import { RefObject, useEffect } from "react"

import { CameraControlRef } from "./CameraControl"


export type ControlActionEnabledOptions = {
    isCameraActive: boolean
    cameraControlRef: RefObject<CameraControlRef>
}


export function useControlActionEnabled(options: ControlActionEnabledOptions) {
    useEffect(() => {
        if (options.isCameraActive) {
            options.cameraControlRef.current?.enableAction()
            return
        }

        options.cameraControlRef.current?.disableAction()
    }, [options.isCameraActive, options.cameraControlRef.current])
}
