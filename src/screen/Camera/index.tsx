import { Screen, StatusBar } from "@elementium/native"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/core"
import { Realm } from "@realm/react"
import { useMemo, useRef, useState } from "react"
import { Alert, StyleProp, ViewStyle, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import { HandlerStateChangeEvent, State, TapGestureHandler, TapGestureHandlerEventPayload } from "react-native-gesture-handler"
import { Camera as RNCamera } from "react-native-vision-camera"

import { EmptyList, HEADER_HEIGHT } from "../../components"
import { DocumentPictureSchema, DocumentSchema, useDocumentModel, useDocumentRealm } from "../../database"
import { useBackHandler, useCameraDevices, useIsForeground } from "../../hooks"
import { translate } from "../../locales"
import { NavigationParamProps, RouteParamProps } from "../../router"
import { DocumentService } from "../../services/document"
import { createAllFolders } from "../../services/folder-handler"
import { log, stringfyError } from "../../services/log"
import { useSettings } from "../../services/settings"
import { CameraControl, CameraControlRef } from "./CameraControl"
import { CameraSettings } from "./CameraSettings"
import { FocusIndicator, FocusIndicatorRef } from "./FocusIndicator"
import { CameraHeader } from "./Header"
import { NoPermissionMessage } from "./NoPermissionMessage"
import { RatioNotSupported } from "./RatioNotSupported"
import { CameraWrapper } from "./style"
import { useCameraOrientation } from "./useCameraOrientation"
import { useControlActionEnabled } from "./useControlActionEnabled"
import { useDisableFocusOnSettingsOpened } from "./useDisableFocusOnSettingsOpened"
import { useIsCameraActive } from "./useIsCameraActive"
import { useIsCameraFlippable } from "./useIsCameraFlippable"
import { useIsShowingCamera } from "./useIsShowingCamera"
import { useRequestCameraPermission } from "./useRequestCameraPermission"
import { useResetCameraOnChangeRatio } from "./useResetCameraOnChangeRatio"
import { getCameraSize } from "./utils"


// TODO update RatioNotSupported to adapt multiple screen dimensions
// TODO add support to multiple back cameras
// TODO add zoom indicator
export function Camera() {


    const navigation = useNavigation<NavigationParamProps<"Camera">>()
    const { params } = useRoute<RouteParamProps<"Camera">>()
    const isFocused = useIsFocused()

    const { width, height } = useWindowDimensions()
    const isForeground = useIsForeground()

    const documentRealm = useDocumentRealm()
    const { settings } = useSettings()
    const { documentModel, setDocumentModel } = useDocumentModel()

    const cameraRef = useRef<RNCamera>(null)
    const cameraControlRef = useRef<CameraControlRef>(null)
    const focusIndicatorRef = useRef<FocusIndicatorRef>(null)

    const [isCameraSettingsVisible, setIsCameraSettingsVisible] = useState(false)

    const cameraSize = useMemo(() => (
        getCameraSize({ width, height }, settings.camera.ratio)
    ), [width, height, settings.camera.ratio])
    const cameraMargin = useMemo(() => {
        const defaultCameraSize = getCameraSize({ width, height }, "3:4")
        if (!defaultCameraSize) return { top: 0 }

        if ((defaultCameraSize.height + HEADER_HEIGHT) < height) {
            return { top: HEADER_HEIGHT }
        }
        return { top: 0 }
    }, [width, height, HEADER_HEIGHT])
    const cameraDevices = useCameraDevices()
    const cameraDevice = cameraDevices ? cameraDevices[settings.camera.type] : undefined
    const cameraOrientation = useCameraOrientation()
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>()
    const isCameraActive = useIsCameraActive({ isFocused, isForeground, hasPermission: hasCameraPermission })
    const isCameraFlippable = useIsCameraFlippable({ cameraDevices })
    const isShowingCamera = useIsShowingCamera({ hasPermission: hasCameraPermission, cameraDevice, cameraSize })
    const [isResetingCamera, setIsResetingCamera] = useState(false)
    const [isFocusEnabled, setIsFocusEnabled] = useState(true)


    const screenStyle: StyleProp<ViewStyle> = useMemo(() => isShowingCamera ? { backgroundColor: "black" } : undefined, [isShowingCamera])


    useBackHandler(() => {
        goBack()
        return true
    })


    function goBack() {
        if (isCameraSettingsVisible) {
            setIsCameraSettingsVisible(false)
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

            const response = await cameraRef.current.takePhoto({
                flash: settings.camera.flash,
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
            throw new Error("Screen action is different of 'replace-picture'. This should not happen")
        if (!documentModel)
            throw new Error("Document model is undefined. This should not happen")

        const oldPictureName = documentModel.pictures[params.replaceIndex].fileName
        documentRealm.write(() => {
            documentModel.document.modifiedAt = Date.now()
            documentModel.pictures[params.replaceIndex].fileName = DocumentService.getFileFullname(newPicturePath)
        })

        const document = documentRealm.objectForPrimaryKey(DocumentSchema, documentModel.document.id)
        const pictures = documentRealm
            .objects(DocumentPictureSchema)
            .filtered("belongsToDocument = $0", documentModel.document.id)
            .sorted("position")
        if (!document) throw new Error("Document is undefined, this should not happen")
        setDocumentModel({ document, pictures })

        DocumentService.deletePicturesService({
            pictures: [DocumentService.getPicturePath(oldPictureName)]
        })

        navigation.navigate("VisualizePicture", {
            pictureIndex: params.replaceIndex,
        })
    }

    function addPicture(newPicturePath: string) {
        let modifiedDocumentId: Realm.BSON.ObjectId

        if (documentModel) {
            documentRealm.write(() => {
                documentRealm.create(DocumentPictureSchema, {
                    fileName: DocumentService.getFileFullname(newPicturePath),
                    belongsToDocument: documentModel.document.id,
                    position: documentModel.pictures.length,
                })

                documentModel.document.modifiedAt = Date.now()
            })

            modifiedDocumentId = documentModel.document.id
        } else {
            modifiedDocumentId = documentRealm.write(() => {
                const now = Date.now()
                const createdDocument = documentRealm.create(DocumentSchema, {
                    createdAt: now,
                    modifiedAt: now,
                    name: DocumentService.getNewName(),
                })

                documentRealm.create(DocumentPictureSchema, {
                    fileName: DocumentService.getFileFullname(newPicturePath),
                    belongsToDocument: createdDocument.id,
                    position: 0,
                })

                return createdDocument.id
            })
        }

        const document = documentRealm.objectForPrimaryKey(DocumentSchema, modifiedDocumentId)
        const pictures = documentRealm
            .objects(DocumentPictureSchema)
            .filtered("belongsToDocument = $0", modifiedDocumentId)
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

    async function onTapStateChange(event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) {
        if (!cameraDevice?.supportsFocus || !isFocusEnabled || !focusIndicatorRef.current || !cameraRef.current) {
            return
        }

        if (event.nativeEvent.state === State.ACTIVE) {
            setIsFocusEnabled(false)

            focusIndicatorRef.current.setFocusPos({
                x: parseInt(event.nativeEvent.absoluteX.toFixed()),
                y: parseInt(event.nativeEvent.absoluteY.toFixed()),
            })
            focusIndicatorRef.current.setIsFocusing(true)

            try {
                await cameraRef.current.focus({
                    x: parseInt(event.nativeEvent.x.toFixed()),
                    y: parseInt(event.nativeEvent.y.toFixed()),
                })
            } catch (error) {
                log.warn(`Error focusing camera ${stringfyError(error)}`)
            }

            setIsFocusEnabled(true)
            focusIndicatorRef.current.setIsFocusing(false)
        }
    }


    const requestCameraPermission = useRequestCameraPermission(setHasCameraPermission)
    useControlActionEnabled({ isCameraActive, cameraControlRef, isCameraSizeCompatible: !!cameraSize })
    useDisableFocusOnSettingsOpened({ isSettingsOpened: isCameraSettingsVisible, setIsFocusEnabled })
    useResetCameraOnChangeRatio(setIsResetingCamera)


    return (
        <Screen style={screenStyle}>
            <StatusBar hidden={isShowingCamera} />

            <CameraHeader
                goBack={goBack}
                openSettings={() => setIsCameraSettingsVisible(true)}
                isShowingCamera={isShowingCamera}
            />

            <NoPermissionMessage
                isVisible={hasCameraPermission === undefined || hasCameraPermission === false}
                requestCameraPermission={requestCameraPermission}
            />

            <EmptyList
                iconName={"camera-off-outline"}
                iconGroup={"material-community"}
                iconSize={56}
                message={translate("Camera_cameraNotAvailable")}
                visible={hasCameraPermission && !cameraDevice}
            />

            <RatioNotSupported
                isVisible={!!hasCameraPermission && !!cameraDevice && !isResetingCamera && !cameraSize}
            />

            {(hasCameraPermission && cameraDevice && !isResetingCamera && cameraSize) && (
                <CameraWrapper style={{ marginTop: cameraMargin.top }}>
                    <TapGestureHandler
                        minPointers={1}
                        enabled={isCameraActive && isFocusEnabled}
                        onHandlerStateChange={onTapStateChange}
                    >
                        <RNCamera
                            ref={cameraRef}
                            isActive={isCameraActive}
                            device={cameraDevice}
                            photo={true}
                            audio={false}
                            enableZoomGesture={true}
                            orientation={cameraOrientation}
                            style={{
                                width: cameraSize.width,
                                height: cameraSize.height,
                            }}
                        />
                    </TapGestureHandler>
                </CameraWrapper>
            )}

            <FocusIndicator ref={focusIndicatorRef} />

            <CameraControl
                ref={cameraControlRef}
                isShowingCamera={isShowingCamera}
                addPictureFromGallery={addPictureFromGallery}
                takePicture={takePicture}
                editDocument={editDocument}
            />

            <CameraSettings
                visible={isCameraSettingsVisible}
                onRequestClose={() => setIsCameraSettingsVisible(false)}
                isCameraFlippable={isCameraFlippable}
            />
        </Screen>
    )
}
