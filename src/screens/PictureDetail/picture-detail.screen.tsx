import { useMemo } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useBackHandler } from '@hooks'
import { useAppTheme } from '@theme'
import type { CropOptions, RotationOptions } from './components'
import {
  ImageRotation,
  PictureDetailHeader,
  PicturesCarousel,
} from './components'
import {
  useCropImage,
  useCurrentPicturePath,
  useGoBack,
  useOpenCameraToReplacePicture,
  usePictureIndex,
  useRotateImage,
  useScreenOverlay,
} from './hooks'


// TODO Add animation when entering and leaving rotate mode
// TODO Add animation when entering and leaving crop mode
// TODO fix scroll not centralized when rotating screen
export function PictureDetail() {


  const safeAreaInsets = useSafeAreaInsets()

  const { isDark } = useAppTheme()


  const {
    currentPictureIndex,
    setCurrentPictureIndex,
  } = usePictureIndex()
  const currentPicturePath = useCurrentPicturePath(currentPictureIndex)

  const screenOverlay = useScreenOverlay()


  const rotateImage = useRotateImage(currentPictureIndex)

  const rotationOptions = useMemo<RotationOptions>(() => ({
    isActive: rotateImage.isRotationMode,
    open: rotateImage.openRotation,
    exit: rotateImage.exitRotation,
    save: rotateImage.saveRotatedImage,
    rotateLeft: rotateImage.rotateLeft,
    rotateRight: rotateImage.rotateRight,
  }), [rotateImage])


  const cropImage = useCropImage()

  const cropOptions = useMemo<CropOptions>(() => ({
    isActive: cropImage.isCropping,
    open: cropImage.openCrop,
    exit: cropImage.exitCrop,
    save: cropImage.saveCroppedImage,
  }), [cropImage])


  const goBack = useGoBack({
    isRotating: rotateImage.isRotationMode,
    exitRotation: rotateImage.exitRotation,
    isCropping: cropImage.isCropping,
    exitCrop: cropImage.exitCrop,
  })

  const openCameraToReplacePicture = useOpenCameraToReplacePicture(
    currentPictureIndex,
  )


  useBackHandler(goBack)


  const isPictureCarouselVisible = (
    !rotateImage.isRotationMode
    && !cropImage.isCropping
  )
  const isImageRotationVisible = rotateImage.isRotationMode
  const isImageCropVisible = cropImage.isCropping


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? 'black' : 'white',
        paddingTop: safeAreaInsets.top,
      }}
    >
      <PictureDetailHeader
        goBack={goBack}
        replacePicture={openCameraToReplacePicture}
        rotation={rotationOptions}
        crop={cropOptions}
        isVisible={screenOverlay.isVisible}
      />

      <PicturesCarousel
        isVisible={isPictureCarouselVisible}
        currentPictureIndex={currentPictureIndex}
        toggleScreenVisibility={screenOverlay.toggleVisibility}
        onCurrentIndexChange={setCurrentPictureIndex}
      />

      <ImageRotation
        ref={rotateImage.imageRotationRef}
        isVisible={isImageRotationVisible}
        currentPicturePath={currentPicturePath}
        isSavingRotatedPicture={rotateImage.isSavingRotatedPicture}
        style={{ flex: 1 }}
      />

      {/* TODO: Implement */}
      {/* {cropImage.isCropping && (
        <ImageCrop
          ref={cropImage.imageCropRef}
          style={{ flex: 1, margin: 32 }}
          sourceUrl={`file://${currentPicturePath}`}
          onSaveImage={cropImage.onCroppedImageSaved}
          onCropError={cropImage.onCropError}
        />
      )} */}
    </View>
  )
}
