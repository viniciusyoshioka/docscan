import { RefObject, useRef, useState } from "react"
import { Alert } from "react-native"

import { useLogger } from "@libs/logger"
import { translate } from "@locales"
import { ImageCrop, OnImageSavedResponse } from "@services/image-crop"


interface CropImage {
  imageCropRef: RefObject<ImageCrop>
  isCropping: boolean
  openCrop: () => void
  exitCrop: () => void
  saveCroppedImage: () => void
  onCroppedImageSaved: (response: OnImageSavedResponse) => void
  onCropError: (response: string) => void
}


export function useCropImage(): CropImage {


  const logger = useLogger()

  const imageCropRef = useRef<ImageCrop>(null)

  const [isCropping, setIsCropping] = useState(false)
  const [isProcessingCrop, setIsProcessingCrop] = useState(false)


  function openCrop() {
    setIsCropping(true)
  }

  function exitCrop() {
    if (isProcessingCrop) return
    setIsCropping(false)
  }

  function saveCroppedImage() {
    if (!imageCropRef.current) return
    if (isProcessingCrop) return

    setIsProcessingCrop(true)
    imageCropRef.current.saveImage()
  }

  function onCroppedImageSaved(response: OnImageSavedResponse) {
    // TODO: Implement
  }

  async function onCropError(response: string) {
    setIsCropping(false)
    setIsProcessingCrop(false)

    Alert.alert(
      translate("warn"),
      translate("VisualizePicture_alert_errorCroppingImage_text"),
    )
    await logger.error(`Error cropping image: "${response}"`)
  }


  return {
    imageCropRef,
    isCropping,
    openCrop,
    exitCrop,
    saveCroppedImage,
    onCroppedImageSaved,
    onCropError,
  }
}
