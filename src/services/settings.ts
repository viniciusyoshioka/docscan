import { CameraRatio, CameraType, FlashType, WhiteBalanceType } from "../types"


// Camera

/**
 * Default value of camera settings's flash
 */
export const cameraFlashDefault: FlashType = "off"

/**
 * Default value of camera settings's white balance
 */
export const cameraWhiteBalanceDefault: WhiteBalanceType = "auto"

/**
 * Default value of camera settings's camera type
 */
export const cameraTypeDefault: CameraType = "back"

/**
 * Default value of camera settings's camera id
 */
export const cameraIdDefault = "0"

/**
 * Default value of camera settings's camera ratio
 */
export const cameraRatioDefault: CameraRatio = "3:4"


/**
 * Convert the CameraRatio type to a number used in camera view
 *
 * @param ratio CameraRatio in use
 *
 * @returns respective ratio as number
 */
export function getCameraRatioNumber(ratio: CameraRatio): number {
    switch (ratio) {
        case "3:4":
            return (4 / 3)
        case "9:16":
            return (16 / 9)
        default:
            throw new Error(`Invalid ratio provided to get the number "${ratio}"`)
    }
}
