import type { RefObject } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useLogger } from '@modules/logger'


// TODO: Tmp
type ImageCrop = object
type OnImageSavedResponse = object


interface CropImage {
  imageCropRef: RefObject<ImageCrop | null>
  isCropping: boolean
  openCrop: () => void
  exitCrop: () => void
  saveCroppedImage: () => void
  onCroppedImageSaved: (response: OnImageSavedResponse) => void
  onCropError: (response: string) => void
}


export function useCropImage(): CropImage {


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()

  const imageCropRef = useRef<ImageCrop | null>(null)

  const [isCropping, setIsCropping] = useState(false)
  const [isProcessingCrop, setIsProcessingCrop] = useState(false)


  const openCrop = useCallback(() => {
    setIsCropping(true)
  }, [])

  const exitCrop = useCallback(() => {
    if (isProcessingCrop) return

    setIsCropping(false)
  }, [isProcessingCrop])

  const saveCroppedImage = useCallback(() => {
    // TODO: Implement

    /*
    if (!imageCropRef.current) return
    if (isProcessingCrop) return

    setIsProcessingCrop(true)
    imageCropRef.current.saveImage()
    */
  }, [imageCropRef, isProcessingCrop])

  const onCroppedImageSaved = useCallback((response: OnImageSavedResponse) => {
    // TODO: Implement
  }, [])

  const onCropError = useCallback(async (response: string) => {
    // TODO: Implement

    /*
    setIsCropping(false)
    setIsProcessingCrop(false)

    Alert.alert(
      t('warn'),
      t('VisualizePicture_alert_errorCroppingImage_text'),
    )
    await logger.error(`Error cropping image: "${response}"`)
    */
  }, [logger])


  const cropImage = useMemo<CropImage>(() => ({
    imageCropRef,
    isCropping,
    openCrop,
    exitCrop,
    saveCroppedImage,
    onCroppedImageSaved,
    onCropError,
  }), [
    imageCropRef,
    isCropping,
    openCrop,
    exitCrop,
    saveCroppedImage,
    onCroppedImageSaved,
    onCropError,
  ])


  return cropImage
}
