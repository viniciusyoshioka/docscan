import { useEffect } from "react"

import { useSettings } from "../../services/settings"


export function useResetCameraOnChangeRatio(setIsResetingCamera: (isReseting: boolean) => void) {


    const { settings } = useSettings()


    useEffect(() => {
        setIsResetingCamera(true)

        setTimeout(() => {
            setIsResetingCamera(false)
        }, 100)
    }, [settings.camera.ratio])
}
