import { useRoute } from "@react-navigation/core"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, View, useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { PictureDTO } from "@database"
import { useBackHandler } from "@hooks"
import { useDocumentState } from "@libs/document-state"
import { RouteProps } from "@router"
import { ImageCrop } from "@services/image-crop"
import { useAppTheme } from "@theme"
import { PictureUtils } from "@utils"
import {
  ImageRotation,
  ImageVisualizationItem,
  VisualizePictureHeader,
} from "./components"
import {
  useCropImage,
  useCurrentPicturePath,
  useGoBack,
  useReplacePicture,
  useRotateImage,
  useScreenOverlay,
  useZoomActivation,
} from "./hooks"


// TODO Add animation when entering and leaving rotate mode
// TODO Add animation when entering and leaving crop mode
// TODO fix scroll not centralized when rotating screen
export function VisualizePicture() {


  const { params } = useRoute<RouteProps<"VisualizePicture">>()
  const { width } = useWindowDimensions()
  const safeAreaInsets = useSafeAreaInsets()

  const { isDark } = useAppTheme()
  const { documentState } = useDocumentState()

  const [currentIndex, setCurrentIndex] = useState(params.pictureIndex)
  const currentPicturePath = useCurrentPicturePath(currentIndex)

  const screenOverlay = useScreenOverlay()
  const zoomActivation = useZoomActivation()
  const rotateImage = useRotateImage(currentIndex)
  const cropImage = useCropImage()

  const goBack = useGoBack({
    isRotating: rotateImage.isRotating,
    exitRotation: rotateImage.exitRotation,
    isCropping: cropImage.isCropping,
    exitCrop: cropImage.exitCrop,
  })
  const replacePicture = useReplacePicture(currentIndex)


  useBackHandler(goBack)


  const renderItem: ListRenderItem<PictureDTO> = ({ item }) => {
    const picturePath = PictureUtils.getPicturePathForFileName(item.fileName)

    return (
      <ImageVisualizationItem
        source={{ uri: `file://${picturePath}` }}
        onZoomActivated={zoomActivation.onZoomActivated}
        onZoomDeactivated={zoomActivation.onZoomDeactivated}
        onSingleTap={screenOverlay.toggleVisibility}
      />
    )
  }

  function onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const newCurrentIndex = Math.round(event.nativeEvent.contentOffset.x / width)
    if (currentIndex !== newCurrentIndex) {
      setCurrentIndex(newCurrentIndex)
    }
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
          isActive: rotateImage.isRotating,
          open: rotateImage.openRotation,
          exit: rotateImage.exitRotation,
          save: rotateImage.saveRotatedImage,
          rotateLeft: rotateImage.rotateLeft,
          rotateRight: rotateImage.rotateRight,
        }}
        crop={{
          isActive: cropImage.isCropping,
          open: cropImage.openCrop,
          exit: cropImage.exitCrop,
          save: cropImage.saveCroppedImage,
        }}
        isShowingOverlay={screenOverlay.isVisible}
      />

      {!rotateImage.isRotating && !cropImage.isCropping && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginLeft: safeAreaInsets.left,
          }}
        >
          <FlashList
            data={documentState?.pictures ?? []}
            renderItem={renderItem}
            estimatedItemSize={width}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            initialScrollIndex={currentIndex}
            scrollEnabled={!zoomActivation.isZoomActive}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
        </View>
      )}

      {rotateImage.isRotating && (
        <ImageRotation
          ref={rotateImage.imageRotationRef}
          source={`file://${currentPicturePath}`}
          style={{ flex: 1 }}
        />
      )}

      {cropImage.isCropping && (
        <ImageCrop
          ref={cropImage.imageCropRef}
          style={{ flex: 1, margin: 32 }}
          sourceUrl={`file://${currentPicturePath}`}
          onSaveImage={cropImage.onCroppedImageSaved}
          onCropError={cropImage.onCropError}
        />
      )}
    </View>
  )
}
