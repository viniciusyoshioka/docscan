import { useIsFocused } from "@react-navigation/native"

import { useIsForeground } from "@hooks"


export type CameraActiveOptions = {
  hasCameraPermission: boolean
}


export function useIsCameraActive(options: CameraActiveOptions): boolean {

  const { hasCameraPermission } = options

  const isFocused = useIsFocused()
  const isForeground = useIsForeground()

  return hasCameraPermission && isFocused && isForeground
}
