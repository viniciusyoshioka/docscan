import { useEffect } from "react"

import { useSettings } from "@libs/settings"


export interface ResetCameraOnChangeRatio {
  setIsResetingCamera: (isReseting: boolean) => void
}


export function useResetCameraOnChangeRatio(attributes: ResetCameraOnChangeRatio) {


  const { setIsResetingCamera } = attributes
  const { settings } = useSettings()


  useEffect(() => {
    setIsResetingCamera(true)

    setTimeout(() => {
      setIsResetingCamera(false)
    }, 0)
  }, [settings.camera.ratio])
}
