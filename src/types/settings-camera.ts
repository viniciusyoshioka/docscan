
export type flashType = "auto" | "on" | "off"

export type whiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

export type cameraType = "front" | "back"


export type CameraAttributes = {
    flash: flashType,
    whiteBalance: whiteBalanceType,
    cameraType: cameraType,
    cameraId: string,
}
