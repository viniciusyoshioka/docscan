import { RefObject, useCallback } from "react"
import { CameraDevice, Camera as VisionCamera } from "react-native-vision-camera"

import { useLogger } from "@libs/logger"
import { stringifyError } from "@utils"
import { FocusIndicatorRef } from "../components"


interface FocusCameraParams {
  cameraDevice: CameraDevice | undefined
  cameraRef: RefObject<VisionCamera>
  focusIndicatorRef: RefObject<FocusIndicatorRef>
  isFocusEnabled: boolean
  setIsFocusEnabled: (newIsFocused: boolean) => void
}


type FocusCamera = (posX: number, posY: number) => Promise<void>


export function useFocusCamera(params: FocusCameraParams): FocusCamera {
  const { cameraDevice, cameraRef, focusIndicatorRef, isFocusEnabled, setIsFocusEnabled } = params


  const logger = useLogger()

  const cameraDeviceSupportsFocus = !!cameraDevice?.supportsFocus


  const focusCamera = useCallback(async (posX: number, posY: number) => {
    if (!isFocusEnabled) {
      await logger.debug("Can't focus camera because focus is disabled")
      return
    }
    if (!cameraDeviceSupportsFocus) {
      await logger.debug("Can't focus camera because the camera device does not support focus")
      return
    }
    if (!focusIndicatorRef.current) {
      await logger.debug("Can't focus camera because the focus indicator ref is not set")
      return
    }
    if (!cameraRef.current) {
      await logger.debug("Can't focus camera because the camera ref is not set")
      return
    }

    try {
      const x = Number(posX.toFixed())
      const y = Number(posY.toFixed())

      setIsFocusEnabled(false)
      focusIndicatorRef.current.setPosition({ x, y })
      focusIndicatorRef.current.setIsFocusing(true)

      await cameraRef.current.focus({ x, y })

      setIsFocusEnabled(true)
      focusIndicatorRef.current.setIsFocusing(false)
    } catch (error) {
      const errorMessage = stringifyError(error)
      await logger.error(`Error focusing camera: ${errorMessage}`)

      setIsFocusEnabled(true)
      focusIndicatorRef.current.setIsFocusing(false)
    }
  }, [isFocusEnabled, cameraDeviceSupportsFocus, logger])


  return focusCamera
}
