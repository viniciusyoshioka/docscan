import { CameraDevice } from "react-native-vision-camera"


export interface IsShowingCamera {
    hasPermission: boolean | undefined;
    cameraDevice: CameraDevice | undefined;
}


export function useIsShowingCamera(attributes: IsShowingCamera): boolean {
    const hasPermission = attributes.hasPermission === true
    const hasDevice = attributes.cameraDevice !== undefined
    return hasPermission && hasDevice
}
