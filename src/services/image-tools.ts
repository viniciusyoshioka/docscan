import { NativeModules } from "react-native"


export type RotationOptions = {
    angle: number;
    pathToSave: string;
}


export interface ImageToolsType {
    rotateDegree: (path: string, options: RotationOptions) => Promise<void>;
}


export const ImageTools = NativeModules.ImageTools as ImageToolsType
