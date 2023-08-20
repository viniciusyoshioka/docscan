import { CameraRatio, getCameraRatioNumber } from "@services/settings"


export type ScreenSize = {
    width: number;
    height: number;
}

export type CameraSize = {
    width: number;
    height: number;
}

export function getCameraSize(screenSize: ScreenSize, cameraRatio: CameraRatio): CameraSize {
    const ratio = getCameraRatioNumber(cameraRatio)
    let cameraWidth = screenSize.width
    let cameraHeight = screenSize.width / ratio
    if (cameraHeight > screenSize.height) {
        cameraHeight = screenSize.height
        cameraWidth = screenSize.height * ratio
    }
    return { width: cameraWidth, height: cameraHeight }
}
