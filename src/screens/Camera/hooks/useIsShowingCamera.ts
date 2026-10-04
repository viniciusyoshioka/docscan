import { useIsFocused } from '@react-navigation/native'

import { useIsForeground } from '@hooks'


interface IsShowingCameraParams {
  isCameraPermissionGranted: boolean
}


export function useIsShowingCamera(params: IsShowingCameraParams): boolean {
  const { isCameraPermissionGranted } = params


  const isForeground = useIsForeground()
  const isFocused = useIsFocused()


  return isForeground && isFocused && isCameraPermissionGranted
}
