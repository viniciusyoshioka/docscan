import { useEffect, useState } from "react"
import { OrientationType } from "react-native-orientation-locker"

import { useDeviceOrientation } from "../../hooks"


export type CameraOrientationType = "portrait" | "portraitUpsideDown" | "landscapeRight" | "landscapeLeft"


export function useCameraOrientation(): CameraOrientationType {


    const deviceOrientation = useDeviceOrientation()

    const [cameraOrientation, setCameraOrientation] = useState<CameraOrientationType>(getCameraOrientation())


    function getCameraOrientation(): CameraOrientationType {
        switch (deviceOrientation) {
            case OrientationType["PORTRAIT"]:
                return "portrait"
            case OrientationType["PORTRAIT-UPSIDEDOWN"]:
                return "portraitUpsideDown"
            case OrientationType["LANDSCAPE-LEFT"]:
                return "landscapeRight"
            case OrientationType["LANDSCAPE-RIGHT"]:
                return "landscapeLeft"
            default:
                return cameraOrientation
        }
    }


    useEffect(() => {
        const newCameraOrientation = getCameraOrientation()
        if (cameraOrientation !== newCameraOrientation) {
            setCameraOrientation(newCameraOrientation)
        }
    }, [deviceOrientation])


    return cameraOrientation
}
