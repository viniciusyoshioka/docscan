import { RefObject, useCallback, useMemo, useRef, useState } from "react"
import { Alert } from "react-native"

import { useLogger } from "@libs/logger"
import { translate } from "@locales"
import { ImageCrop, OnImageSavedResponse } from "@services/image-crop"


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
    if (!imageCropRef.current) return
    if (isProcessingCrop) return

    setIsProcessingCrop(true)
    imageCropRef.current.saveImage()
  }, [isProcessingCrop])

  const onCroppedImageSaved = useCallback((response: OnImageSavedResponse) => {
    // TODO: Implement
  }, [])

  const onCropError = useCallback(async (response: string) => {
    setIsCropping(false)
    setIsProcessingCrop(false)

    Alert.alert(
      translate("warn"),
      translate("VisualizePicture_alert_errorCroppingImage_text"),
    )
    await logger.error(`Error cropping image: "${response}"`)
  }, [logger])


  const cropImage = useMemo(() => ({
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
