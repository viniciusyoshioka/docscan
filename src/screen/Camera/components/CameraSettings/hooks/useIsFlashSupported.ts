import { useMemo } from "react"
import { useCameraDevices } from "react-native-vision-camera"

import { useSettings } from "@libs/settings"


export function useIsFlashSupported(): boolean {


  const { settings } = useSettings()

  const cameraDevices = useCameraDevices()


  const isFlashSupported = useMemo(() => {
    const hasDeviceWithFlashSupport = cameraDevices
      .filter(cameraDevice => cameraDevice.position === settings.camera.position)
      .some(cameraDevice => cameraDevice.hasFlash)

    return hasDeviceWithFlashSupport
  }, [cameraDevices, settings.camera.position])


  return isFlashSupported
}
