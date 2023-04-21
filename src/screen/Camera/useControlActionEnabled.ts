import { RefObject, useEffect } from "react"

import { CameraControlRef } from "./CameraControl"


export interface ControlActionEnabled {
    isCameraActive: boolean;
    cameraControlRef: RefObject<CameraControlRef>;
}


export function useControlActionEnabled(attributes: ControlActionEnabled) {
    useEffect(() => {
        if (attributes.isCameraActive) {
            attributes.cameraControlRef.current?.enableAction()
            return
        }

        attributes.cameraControlRef.current?.disableAction()
    }, [attributes.isCameraActive, attributes.cameraControlRef.current])
}
