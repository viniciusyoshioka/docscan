import { RefObject, useCallback } from "react"
import RNFS from "react-native-fs"
import { Camera as VisionCamera } from "react-native-vision-camera"

import { useSettings } from "@libs/settings"
import { createAllFolders } from "@services/folder-handler"
import { normalizeError, PictureUtils } from "@utils"
import { PictureTakenFeedbackRef } from "../components"


interface TakePictureWithCallbackParams {
  cameraRef: RefObject<VisionCamera | null>
  pictureTakenFeedbackRef: RefObject<PictureTakenFeedbackRef | null>
  onPictureTaken: (picturePath: string) => Promise<void>
  onTakePictureError: (error: Error) => Promise<void>
}


type TakePicture = () => Promise<void>


export function useTakePictureWithCallback(params: TakePictureWithCallbackParams): TakePicture {
  const { cameraRef, pictureTakenFeedbackRef, onPictureTaken, onTakePictureError } = params


  const { settings } = useSettings()


  const takePicture = useCallback(async () => {
    try {
      if (!cameraRef.current) {
        throw new Error("Can't take picture because cameraRef is not available")
      }

      await createAllFolders()

      pictureTakenFeedbackRef.current?.showFeedback()
      const response = await cameraRef.current.takePhoto({
        enableShutterSound: false,
        flash: settings.camera.flash,
      })

      const picturePath = await PictureUtils.getNewPicturePathWithSameExtension(response.path)
      await RNFS.moveFile(response.path, picturePath)

      await onPictureTaken(picturePath)
    } catch (error) {
      const errorInstance = normalizeError(error)
      await onTakePictureError(errorInstance)
    }
  }, [
    cameraRef,
    pictureTakenFeedbackRef,
    settings.camera.flash,
    onPictureTaken,
    onTakePictureError,
  ])


  return takePicture
}
