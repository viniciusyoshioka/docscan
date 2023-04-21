import { useMemo } from "react"
import { CameraDevices } from "react-native-vision-camera"


export interface IsCameraFlippable {
    cameraDevices: CameraDevices | undefined;
}


export function useIsCameraFlippable(attributes: IsCameraFlippable): boolean {
    return useMemo(() =>
        attributes.cameraDevices !== undefined
        && attributes.cameraDevices.back !== undefined
        && attributes.cameraDevices.front !== undefined
    , [attributes.cameraDevices])
}
