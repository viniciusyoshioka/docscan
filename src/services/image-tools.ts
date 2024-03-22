import { NativeModules } from "react-native"


export type ImageSize = {
  width: number
  height: number
}

export type RotationOptions = {
  sourcePath: string
  destinationPath: string
  angle: number
}


export interface ImageToolsType {
  getSize: (path: string) => Promise<ImageSize>
  rotate: (options: RotationOptions) => Promise<void>
}


export const ImageTools = NativeModules.ImageTools as ImageToolsType
