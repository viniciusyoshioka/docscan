import { useNavigation, useRoute } from "@react-navigation/core"
import { FlashList } from "@shopify/flash-list"
import { useMemo, useRef, useState } from "react"
import { Alert, View, useWindowDimensions } from "react-native"
import RNFS from "react-native-fs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import {
  DocumentPictureRealmSchema,
  DocumentRealmSchema,
  useDocumentModel,
  useDocumentRealm,
} from "@database"
import { useBackHandler } from "@hooks"
import { useLogger } from "@lib/log"
import { translate } from "@locales"
import { NavigationProps, RouteProps } from "@router"
import { DocumentService } from "@services/document"
import { ImageCrop, OnImageSavedResponse } from "@services/image-crop"
import { useAppTheme } from "@theme"
import { stringifyError } from "@utils"
import { VisualizePictureHeader } from "./Header"
import { ImageRotation, ImageRotationRef } from "./ImageRotation"
import { ImageVisualizationItem } from "./ImageVisualizationItem"


// TODO Add animation when entering and leaving rotate mode
// TODO Add animation when entering and leaving crop mode
// TODO fix documentModel === undefined when device theme is toggle while in this screen
// TODO fix scroll not centralized when rotating screen
export function VisualizePicture() {


  const navigation = useNavigation<NavigationProps<"VisualizePicture">>()
  const { params } = useRoute<RouteProps<"VisualizePicture">>()
  const { width } = useWindowDimensions()
  const safeAreaInsets = useSafeAreaInsets()
  const log = useLogger()

  const { isDark } = useAppTheme()
  const documentRealm = useDocumentRealm()
  const { documentModel, setDocumentModel } = useDocumentModel()

  const imageRotationRef = useRef<ImageRotationRef>(null)
  const imageCropRef = useRef<ImageCrop>(null)

  const [isRotating, setIsRotating] = useState(false)
  const [isRotationProcessing, setIsRotationProcessing] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [isCropProcessing, setIsCropProcessing] = useState(false)
  const [isShowingOverlay, setIsShowingOverlay] = useState(true)
  const [isFlatListScrollEnable, setIsFlatListScrollEnable] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(params.pictureIndex)
  const currentPicturePath = useMemo(() => {
    if (!documentModel)
      throw new Error("Document model is undefined. This should not happen")

    const index = Math.round(currentIndex)
    const fileName = documentModel.pictures[index].fileName
    return DocumentService.getPicturePath(fileName)
  }, [documentModel, currentIndex])


  useBackHandler(() => {
    goBack()
    return true
  })


  function goBack() {
    if (isRotating) {
      exitRotation()
      return
    }
    if (isCropping) {
      exitCrop()
      return
    }

    navigation.goBack()
  }

  function replacePicture() {
    navigation.navigate("Camera", {
      screenAction: "replace-picture",
      replaceIndex: currentIndex,
    })
  }

  function exitRotation() {
    if (!isRotationProcessing) setIsRotating(false)
  }

  function rotateLeft() {
    if (!isRotationProcessing && imageRotationRef.current)
      imageRotationRef.current.rotateLeft()
  }

  function rotateRight() {
    if (!isRotationProcessing && imageRotationRef.current)
      imageRotationRef.current.rotateRight()
  }

  async function saveRotatedPicture() {
    if (isRotationProcessing) return
    if (!documentModel)
      throw new Error("Document model is undefined. This should not happen")
    if (!imageRotationRef.current) return

    const rotatedDegrees = imageRotationRef.current.getRotationDegree()
    if (rotatedDegrees && (rotatedDegrees % 360) === 0) {
      setIsRotating(false)
      return
    }

    setIsRotationProcessing(true)

    const pictureNameToRotate = documentModel.pictures[currentIndex].fileName
    const picturePathRotated = await DocumentService.getNewPicturePath(
      pictureNameToRotate
    )
    try {
      await imageRotationRef.current.save(picturePathRotated)
      replacePictureInDatabase(picturePathRotated)
    } catch (error) {
      log.error(`Error saving rotated picture: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("VisualizePicture_alert_errorSavingRotatedImage_text")
      )

      setIsRotating(false)
      setIsRotationProcessing(false)
      return
    }

    try {
      const picturePathToDelete = DocumentService.getPicturePath(pictureNameToRotate)
      await RNFS.unlink(picturePathToDelete)
    } catch (error) {
      log.warn(`Error deleting original image after rotate: "${stringifyError(error)}"`)
    }

    setIsRotating(false)
    setIsRotationProcessing(false)
  }

  function exitCrop() {
    if (!isCropProcessing) setIsCropping(false)
  }

  function saveCroppedPicture() {
    if (!isCropProcessing && imageCropRef.current) {
      setIsCropProcessing(true)
      imageCropRef.current.saveImage()
    }
  }

  function renderItem({ item }: { item: DocumentPictureRealmSchema }) {
    const picturePath = DocumentService.getPicturePath(item.fileName)
    return (
      <ImageVisualizationItem
        source={{ uri: `file://${picturePath}` }}
        onZoomActivated={() => setIsFlatListScrollEnable(false)}
        onZoomDeactivated={() => setIsFlatListScrollEnable(true)}
        onSingleTap={() => setIsShowingOverlay(!isShowingOverlay)}
      />
    )
  }

  async function onCroppedImageSaved(response: OnImageSavedResponse) {
    if (!documentModel)
      throw new Error("Document model is undefined. This should not happen")

    const pictureName = documentModel.pictures[currentIndex].fileName
    const picturePath = DocumentService.getPicturePath(pictureName)

    try {
      const croppedPicturePath = await DocumentService.getNewPicturePath(response.uri)
      await RNFS.moveFile(response.uri, croppedPicturePath)
      replacePictureInDatabase(croppedPicturePath)
    } catch (error) {
      if (await RNFS.exists(response.uri)) {
        await RNFS.unlink(response.uri)
      }

      log.error(`Error replacing image by cropped image: "${stringifyError(error)}"`)
      Alert.alert(
        translate("warn"),
        translate("VisualizePicture_alert_errorSavingCroppedImage_text")
      )

      setIsCropping(false)
      setIsCropProcessing(false)
      return
    }

    try {
      if (await RNFS.exists(picturePath)) {
        await RNFS.unlink(picturePath)
      }
    } catch (error) {
      log.warn(`Error deleting original image after crop: "${stringifyError(error)}"`)
    }

    setIsCropping(false)
    setIsCropProcessing(false)
  }

  function onCropError(response: string) {
    log.error(`Error cropping image: "${response}"`)
    Alert.alert(
      translate("warn"),
      translate("VisualizePicture_alert_errorCroppingImage_text")
    )
    setIsCropping(false)
    setIsCropProcessing(false)
  }

  function replacePictureInDatabase(filePath: string) {
    if (!documentModel)
      throw new Error("Document model is undefined. This should not happen")

    documentRealm.write(() => {
      documentModel.document.modifiedAt = Date.now()
      documentModel.pictures[params.pictureIndex].fileName =
        DocumentService.getFileFullname(filePath)
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
  }


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "black" : "white",
        paddingTop: safeAreaInsets.top,
      }}
    >
      <VisualizePictureHeader
        goBack={goBack}
        replacePicture={replacePicture}
        rotation={{
          isActive: isRotating,
          open: () => setIsRotating(true),
          exit: exitRotation,
          save: saveRotatedPicture,
          rotateLeft: rotateLeft,
          rotateRight: rotateRight,
        }}
        crop={{
          isActive: isCropping,
          open: () => setIsCropping(true),
          exit: exitCrop,
          save: saveCroppedPicture,
        }}
        isShowingOverlay={isShowingOverlay}
      />

      {!isRotating && !isCropping && (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <FlashList
            data={documentModel?.pictures.toJSON() as unknown as DocumentPictureRealmSchema[]}
            renderItem={renderItem}
            estimatedItemSize={width}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            initialScrollIndex={currentIndex}
            scrollEnabled={isFlatListScrollEnable}
            onMomentumScrollEnd={({ nativeEvent }) => {
              const newCurrentIndex = nativeEvent.contentOffset.x / width
              if (currentIndex !== newCurrentIndex) {
                setCurrentIndex(newCurrentIndex)
              }
            }}
          />
        </View>
      )}

      {isRotating && (
        <ImageRotation
          ref={imageRotationRef}
          source={`file://${currentPicturePath}`}
          style={{ flex: 1 }}
        />
      )}

      {isCropping && (
        <ImageCrop
          ref={imageCropRef}
          style={{ flex: 1, margin: 16 }}
          sourceUrl={`file://${currentPicturePath}`}
          onSaveImage={onCroppedImageSaved}
          onCropError={onCropError}
        />
      )}
    </View>
  )
}
