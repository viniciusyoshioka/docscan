import { useEffect, useState } from "react"
import { OrientationType } from "react-native-orientation-locker"
import { Orientation } from "react-native-vision-camera"

import { useDeviceOrientation } from "@hooks"


export function useCameraOrientation(): Orientation {


    const deviceOrientation = useDeviceOrientation()

    const [cameraOrientation, setCameraOrientation] = useState(getCameraOrientation())


    function getCameraOrientation(): Orientation {
        switch (deviceOrientation) {
            case OrientationType["PORTRAIT"]:
                return "portrait"
            case OrientationType["PORTRAIT-UPSIDEDOWN"]:
                return "portrait-upside-down"
            case OrientationType["LANDSCAPE-LEFT"]:
                return "landscape-left"
            case OrientationType["LANDSCAPE-RIGHT"]:
                return "landscape-right"
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
