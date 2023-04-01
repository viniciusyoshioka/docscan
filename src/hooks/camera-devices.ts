import { CameraDevices, LogicalCameraDeviceType, PhysicalCameraDeviceType, useCameraDevices as useVisionCameraDevices } from "react-native-vision-camera"

import { log, stringfyError } from "../services/log"


export function useCameraDevices(
    deviceType?: PhysicalCameraDeviceType | LogicalCameraDeviceType
): CameraDevices | undefined {
    let cameraDevices: CameraDevices | undefined = undefined

    try {
        if (deviceType) {
            cameraDevices = useVisionCameraDevices(deviceType)
        } else {
            cameraDevices = useVisionCameraDevices()
        }
    } catch (error) {
        log.error(`Error getting camera devices: "${stringfyError(error)}"`)
    }

    return cameraDevices
}
