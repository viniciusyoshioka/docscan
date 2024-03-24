import { useEffect } from "react"

import { useSettings } from "@lib/settings"


export interface ResetCameraOnChangeRatio {
  setIsResetingCamera: (isReseting: boolean) => void
}


export function useResetCameraOnChangeRatio(attrs: ResetCameraOnChangeRatio) {


  const { setIsResetingCamera } = attrs
  const { settings } = useSettings()


  useEffect(() => {
    setIsResetingCamera(true)

    setTimeout(() => {
      setIsResetingCamera(false)
    }, 0)
  }, [settings.camera.ratio])
}
