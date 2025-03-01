import { useMemo } from "react"
import { useCameraDevices } from "react-native-vision-camera"

import { useSettings } from "@libs/settings"
import { getCameraRatioFromRatioNumber } from "../../../utils"


export function useIsRatioSupported(): boolean {


  const { settings } = useSettings()

  const cameraDevices = useCameraDevices()


  const isRatioSupported = useMemo(() => {
    const hasDeviceWithRatioSupport = cameraDevices
      .filter(cameraDevice => cameraDevice.position === settings.camera.position)
      .map(cameraDevice => cameraDevice.formats)
      .flat()
      .some(cameraFormat => {
        const { photoWidth, photoHeight } = cameraFormat
        const ratioNumber = photoWidth / photoHeight
        try {
          return !!getCameraRatioFromRatioNumber(ratioNumber)
        } catch (error) {
          return false
        }
      })

    return hasDeviceWithRatioSupport
  }, [cameraDevices, settings.camera.position])


  return isRatioSupported
}
