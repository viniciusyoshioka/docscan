import { useMemo } from "react"
import { useWindowDimensions } from "react-native"

import { useSettings } from "@libs/settings"
import { getCameraSizeToFitInScreen, Size } from "../../../utils"


export function useCameraSize(): Size {


  const { width, height } = useWindowDimensions()

  const { settings } = useSettings()


  const cameraSize = useMemo(() => (
    getCameraSizeToFitInScreen({ width, height }, settings.camera.ratio)
  ), [width, height, settings.camera.ratio])


  return cameraSize
}
