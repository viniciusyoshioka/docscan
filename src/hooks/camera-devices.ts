import { CameraDevices, LogicalCameraDeviceType, PhysicalCameraDeviceType, useCameraDevices as useVisionCameraDevices } from "react-native-vision-camera"

import { log, stringfyError } from "@services/log"


export type CameraDeviceType = PhysicalCameraDeviceType | LogicalCameraDeviceType


export function useCameraDevices(deviceType?: CameraDeviceType): CameraDevices | undefined {
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
