import { CameraRatio, getCameraRatioNumber } from "../../services/settings"


export type ScreenSize = {
    width: number;
    height: number;
}

export type CameraSize = {
    width: number;
    height: number;
}

export function getCameraSize(screenSize: ScreenSize, cameraRatio: CameraRatio): CameraSize | undefined {
    const cameraWidth = screenSize.width
    const cameraHeight = screenSize.width / getCameraRatioNumber(cameraRatio)
    if (cameraHeight > screenSize.height) {
        return undefined
    }
    return { width: cameraWidth, height: cameraHeight }
}
