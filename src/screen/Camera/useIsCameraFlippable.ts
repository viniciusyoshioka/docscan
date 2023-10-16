import { useCameraDevices } from "react-native-vision-camera"


export function useIsCameraFlippable(): boolean {

    const cameraDevices = useCameraDevices()

    const hasFrontal = !!cameraDevices.find(cameraDevice => cameraDevice.position === "front")
    const hasBack = !!cameraDevices.find(cameraDevice => cameraDevice.position === "back")

    return hasFrontal && hasBack
}
