import { CameraDevices, LogicalCameraDeviceType, PhysicalCameraDeviceType, useCameraDevices as useVisionCameraDevices } from "react-native-vision-camera"

import { log, stringfyError } from "../services/log"


/**
 * Wraps `useCameraDevice` from react-native-vision-camera to handle erros
 *
 * @param deviceType The device type to get. `PhysicalCameraDeviceType` or
 * `LogicalCameraDeviceType`. Defaults to undefined
 *
 * @returns `CameraDevices` that were selected. Returns undefined if
 * an error is thrown by vision camera's `useCameraDevices`
 */
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
