import { CameraDevice } from "react-native-vision-camera"

import { CameraSize } from "./utils"


export interface IsShowingCamera {
    hasPermission: boolean | undefined;
    cameraDevice: CameraDevice | undefined;
    cameraSize: CameraSize | undefined;
}


export function useIsShowingCamera(attributes: IsShowingCamera): boolean {
    const hasPermission = attributes.hasPermission === true
    const hasDevice = attributes.cameraDevice !== undefined
    const hasCameraSize = attributes.cameraSize !== undefined
    return hasPermission && hasDevice && hasCameraSize
}
