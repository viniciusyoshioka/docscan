import { RefObject, useEffect } from "react"

import { CameraControlRef } from "./CameraControl"


export interface ControlActionEnabled {
    isCameraActive: boolean;
    cameraControlRef: RefObject<CameraControlRef>;
    isCameraSizeCompatible: boolean;
}


export function useControlActionEnabled(attributes: ControlActionEnabled) {
    useEffect(() => {
        if (attributes.isCameraActive && attributes.isCameraSizeCompatible) {
            attributes.cameraControlRef.current?.enableAction()
            return
        }

        attributes.cameraControlRef.current?.disableAction()
    }, [
        attributes.isCameraActive,
        attributes.cameraControlRef.current,
        attributes.isCameraSizeCompatible,
    ])
}
