import { RefObject, useCallback } from "react"

import { useLogger } from "@libs/logger"
import { CameraViewRef } from "../components"


export function useTakePicture(cameraViewRef: RefObject<CameraViewRef | null>) {


  const logger = useLogger()


  const takePicture = useCallback(async () => {
    if (!cameraViewRef.current) {
      await logger.debug("Can't take picture because cameraViewRef is not available")
      return
    }

    await cameraViewRef.current.takePicture()
  }, [cameraViewRef, logger])


  return takePicture
}
