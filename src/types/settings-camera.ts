
/**
 * All camera flash setting options
 */
export type FlashType = "auto" | "on" | "off"

/**
 * All camera white balande setting options
 */
export type WhiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

/**
 * All camera type setting options
 */
export type CameraType = "front" | "back"


/**
 * Type of the complete camera settings object
 */
export type CameraSettingsObject = {
    flash: FlashType;
    whiteBalance: WhiteBalanceType;
    cameraType: CameraType;
    cameraId: string;
}
