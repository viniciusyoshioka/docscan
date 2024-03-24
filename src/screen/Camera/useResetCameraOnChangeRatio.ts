import { useEffect } from "react"

import { useSettings } from "@lib/settings"


export function useResetCameraOnChangeRatio(
  setIsResetingCamera: (isReseting: boolean) => void
) {


  const { settings } = useSettings()


  useEffect(() => {
    setIsResetingCamera(true)

    setTimeout(() => {
      setIsResetingCamera(false)
    }, 0)
  }, [settings.camera.ratio])
}
