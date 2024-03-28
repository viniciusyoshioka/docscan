import { useNavigation, useRoute } from "@react-navigation/native"
import { Realm } from "@realm/react"
import { useRef, useState } from "react"
import { Alert, StyleSheet, View, ViewStyle, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { EmptyScreen, useModal } from "react-native-paper-towel"
import { useStyles } from "react-native-unistyles"
import {
  Camera as VisionCamera,
  useCameraDevice,
  useCameraFormat,
} from "react-native-vision-camera"

import {
  DocumentPictureRealmSchema,
  DocumentRealmSchema,
  useDocumentModel,
  useDocumentRealm,
} from "@database"
import { useBackHandler } from "@hooks"
import { useSettings } from "@lib/settings"
import { getCameraRatioNumber } from "@lib/settings/camera"
import { translate } from "@locales"
import { NavigationProps, RouteProps } from "@router"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { log, stringfyError } from "@services/log"
import { CameraControl, CameraControlRef } from "./CameraControl"
import { CameraSettings } from "./CameraSettings"
import { FocusIndicator, FocusIndicatorRef } from "./FocusIndicator"
import { CameraHeader } from "./Header"
import { NoPermissionMessage } from "./NoPermissionMessage"
import { PictureTakenFeedback, PictureTakenFeedbackRef } from "./PictureTakenFeedback"
import { stylesheet } from "./style"
import { useCameraMargin } from "./useCameraMargin"
import { useCameraOrientation } from "./useCameraOrientation"
import { useControlActionEnabled } from "./useControlActionEnabled"
import { useDisableFocusOnSettingsOpen } from "./useDisableFocusOnSettingsOpened"
import { useIsCameraActive } from "./useIsCameraActive"
import { useIsShowingCamera } from "./useIsShowingCamera"
import { useRequestCameraPermission } from "./useRequestCameraPermission"
import { useResetCameraOnChangeRatio } from "./useResetCameraOnChangeRatio"
import { useStatusBarStyle } from "./useStatusBarStyle"
import { getCameraSize } from "./utils"


// TODO add support to multiple back cameras
// TODO add zoom indicator
export function Camera() {


  const navigation = useNavigation<NavigationProps<"Camera">>()
  const { params } = useRoute<RouteProps<"Camera">>()
  const { width, height } = useWindowDimensions()
  const { styles } = useStyles(stylesheet)

  const documentRealm = useDocumentRealm()
  const { settings } = useSettings()
  const { documentModel, setDocumentModel } = useDocumentModel()

  const cameraRef = useRef<VisionCamera>(null)
  const pictureTakenFeedbackRef = useRef<PictureTakenFeedbackRef>(null)
  const cameraControlRef = useRef<CameraControlRef>(null)
  const focusIndicatorRef = useRef<FocusIndicatorRef>(null)

  const cameraSettings = useModal()

  const cameraDevice = useCameraDevice(settings.camera.position)
  const cameraFormat = useCameraFormat(cameraDevice, [
    { photoAspectRatio: getCameraRatioNumber(settings.camera.ratio) },
    { photoResolution: "max" },
  ])
  const cameraSize = getCameraSize({ width, height }, settings.camera.ratio)
  const cameraOrientation = useCameraOrientation()
  const { hasCameraPermission, requestCameraPermission } = useRequestCameraPermission()
  const isCameraActive = useIsCameraActive({ hasCameraPermission })
  const isShowingCamera = useIsShowingCamera({ hasCameraPermission, cameraDevice })
  const cameraMargin = useCameraMargin({ isShowingCamera })
  const [isFocusEnabled, setIsFocusEnabled] = useState(true)
  const [isResetingCamera, setIsResetingCamera] = useState(false)


  const screenStyle: ViewStyle = {
    flex: 1,
    backgroundColor: isShowingCamera ? "black" : undefined,
  }


  useBackHandler(() => {
    goBack()
    return true
  })


  function goBack() {
    if (cameraSettings.isVisible) {
      cameraSettings.hide()
      return
    }

    if (params?.screenAction === "replace-picture") {
      navigation.navigate("VisualizePicture", { pictureIndex: params.replaceIndex })
    } else if (params?.screenAction === "add-picture") {
      navigation.navigate("EditDocument")
    } else {
      setDocumentModel(undefined)
      navigation.goBack()
    }
  }

  function addPictureFromGallery() {
    if (params?.screenAction === "replace-picture") {
      navigation.navigate("Gallery", params)
    } else {
      navigation.navigate("Gallery", { screenAction: "add-picture" })
    }
  }

  async function takePicture() {
    await createAllFolders()

    try {
      if (!cameraRef.current) throw new Error("Camera ref is undefined")

      pictureTakenFeedbackRef.current?.showFeedback()
      const response = await cameraRef.current.takePhoto({
        flash: settings.camera.flash,
        enableShutterSound: false,
      })

      const picturePath = await DocumentService.getNewPicturePath(response.path)
      await RNFS.moveFile(response.path, picturePath)

      if (params?.screenAction === "replace-picture") {
        replacePicture(picturePath)
      } else {
        addPicture(picturePath)
      }
    } catch (error) {
      log.error(`Error taking picture: "${stringfyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("Camera_alert_unknownErrorTakingPicture_text")
      )
    }
  }

  function replacePicture(newPicturePath: string) {
    if (params?.screenAction !== "replace-picture")
      throw new Error(
        "Screen action is different of 'replace-picture'. This should not happen"
      )
    if (!documentModel)
      throw new Error("Document model is undefined. This should not happen")

    const oldPictureName = documentModel.pictures[params.replaceIndex].fileName
    documentRealm.write(() => {
      documentModel.document.modifiedAt = Date.now()
      documentModel.pictures[params.replaceIndex].fileName =
        DocumentService.getFileFullname(newPicturePath)
    })

    const document = documentRealm.objectForPrimaryKey(
      DocumentRealmSchema,
      documentModel.document.id
    )
    const pictures = documentRealm
      .objects(DocumentPictureRealmSchema)
      .filtered("belongsTo = $0", documentModel.document.id)
      .sorted("position")
    if (!document) throw new Error("Document is undefined, this should not happen")
    setDocumentModel({ document, pictures })

    DocumentService.deletePicturesService({
      pictures: [DocumentService.getPicturePath(oldPictureName)],
    })

    navigation.navigate("VisualizePicture", {
      pictureIndex: params.replaceIndex,
    })
  }

  function addPicture(newPicturePath: string) {
    let modifiedDocumentId: Realm.BSON.ObjectId

    if (documentModel) {
      documentRealm.write(() => {
        documentRealm.create(DocumentPictureRealmSchema, {
          fileName: DocumentService.getFileFullname(newPicturePath),
          belongsTo: documentModel.document.id,
          position: documentModel.pictures.length,
        })

        documentModel.document.modifiedAt = Date.now()
      })

      modifiedDocumentId = documentModel.document.id
    } else {
      modifiedDocumentId = documentRealm.write(() => {
        const now = Date.now()
        const createdDocument = documentRealm.create(DocumentRealmSchema, {
          createdAt: now,
          modifiedAt: now,
          name: DocumentService.getNewName(),
        })

        documentRealm.create(DocumentPictureRealmSchema, {
          fileName: DocumentService.getFileFullname(newPicturePath),
          belongsTo: createdDocument.id,
          position: 0,
        })

        return createdDocument.id
      })
    }

    const document = documentRealm.objectForPrimaryKey(DocumentRealmSchema, modifiedDocumentId)
    const pictures = documentRealm
      .objects(DocumentPictureRealmSchema)
      .filtered("belongsTo = $0", modifiedDocumentId)
      .sorted("position")
    if (!document) throw new Error("Document is undefined, this should not happen")
    setDocumentModel({ document, pictures })
  }

  function editDocument() {
    if (params?.screenAction === "add-picture") {
      navigation.goBack()
    } else {
      navigation.replace("EditDocument")
    }
  }

  const tapGesture = Gesture.Tap()
    .enabled(isCameraActive && isFocusEnabled)
    .minPointers(1)
    .onEnd(async event => {
      if (cameraDevice?.supportsFocus === undefined) return
      if (cameraDevice?.supportsFocus === false) return
      if (!isFocusEnabled) return
      if (!cameraRef.current || !focusIndicatorRef.current) return

      try {
        setIsFocusEnabled(false)

        const x = parseInt(event.x.toFixed())
        const y = parseInt(event.y.toFixed())

        focusIndicatorRef.current.setFocusPos({ x, y })
        focusIndicatorRef.current.setIsFocusing(true)

        await cameraRef.current.focus({ x, y })
      } catch (error) {
        log.warn(`Error focusing camera ${stringfyError(error)}`)
      } finally {
        setIsFocusEnabled(true)
        focusIndicatorRef.current.setIsFocusing(false)
      }
    })


  useControlActionEnabled({
    isCameraActive,
    cameraControlRef,
  })
  useDisableFocusOnSettingsOpen({
    isSettingsOpen: cameraSettings.isVisible,
    setIsFocusEnabled,
  })
  useResetCameraOnChangeRatio({ setIsResetingCamera })
  useStatusBarStyle(isShowingCamera)


  return (
    <View style={screenStyle}>
      <CameraHeader
        goBack={goBack}
        openSettings={() => cameraSettings.show()}
        isShowingCamera={isShowingCamera}
      />

      <NoPermissionMessage
        hasCameraPermission={hasCameraPermission}
        requestCameraPermission={requestCameraPermission}
      />

      <EmptyScreen.Content visible={hasCameraPermission && !cameraDevice}>
        <EmptyScreen.Icon
          name={"camera-off-outline"}
          group={"material-community"}
          size={56}
        />

        <EmptyScreen.Message>
          {translate("Camera_cameraNotAvailable")}
        </EmptyScreen.Message>
      </EmptyScreen.Content>

      {(hasCameraPermission && cameraDevice && !isResetingCamera) && (
        <View style={[styles.cameraWrapper, { marginTop: cameraMargin.top }]}>
          <GestureDetector gesture={tapGesture}>
            <View style={cameraSize}>
              <VisionCamera
                ref={cameraRef}
                isActive={isCameraActive}
                device={cameraDevice}
                format={cameraFormat}
                photo={true}
                audio={false}
                enableZoomGesture={true}
                orientation={cameraOrientation}
                style={StyleSheet.absoluteFill}
              />

              <FocusIndicator ref={focusIndicatorRef} />

              <PictureTakenFeedback ref={pictureTakenFeedbackRef} />
            </View>
          </GestureDetector>
        </View>
      )}

      <CameraControl
        ref={cameraControlRef}
        isShowingCamera={isShowingCamera}
        addPictureFromGallery={addPictureFromGallery}
        takePicture={takePicture}
        editDocument={editDocument}
      />

      <CameraSettings
        visible={cameraSettings.isVisible}
        onRequestClose={() => cameraSettings.hide()}
      />
    </View>
  )
}
