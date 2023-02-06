import { NativeModules } from "react-native"


export type ImageSize = {
    width: number;
    height: number;
}

export type RotationOptions = {
    angle: number;
    pathToSave: string;
}


export interface ImageToolsType {
    getSize: (path: string) => Promise<ImageSize>;
    rotateDegree: (path: string, options: RotationOptions) => Promise<void>;
}


export const ImageTools = NativeModules.ImageTools as ImageToolsType
