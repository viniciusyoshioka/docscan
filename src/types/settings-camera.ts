
/**
 * All camera flash setting options
 */
export type flashType = "auto" | "on" | "off"

/**
 * All camera white balande setting options
 */
export type whiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

/**
 * All camera type setting options
 */
export type cameraType = "front" | "back"


/**
 * Type of the complete camera settings object
 */
export type CameraAttributes = {
    flash: flashType;
    whiteBalance: whiteBalanceType;
    cameraType: cameraType;
    cameraId: string;
}
