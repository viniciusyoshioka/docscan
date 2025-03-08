import { CompressionLevel } from "./types"


type CompressionValueFromLevel = {
  [key in CompressionLevel]: number
}

export const compressionValueFromLevel: CompressionValueFromLevel = {
  [CompressionLevel.LOW]: 20,
  [CompressionLevel.HIGH]: 60,
  [CompressionLevel.CUSTOM]: 50,
}
