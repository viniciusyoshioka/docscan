import type { ViewStyle } from 'react-native'
import { Appbar } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAppTheme } from '@theme'
import { styles } from './camera-header.styles.ts'


interface CameraHeaderProps {
  goBack: () => void
  openCameraSettings: () => void
  isShowingCamera: boolean
}


export function CameraHeader(props: CameraHeaderProps) {
  const { goBack, openCameraSettings, isShowingCamera } = props


  const safeAreaInsets = useSafeAreaInsets()

  const { isDark } = useAppTheme()


  const isHeaderActionDisabled = !isShowingCamera


  const headerCameraBasedStyle = isShowingCamera
    ? styles.headerWithCamera
    : styles.headerWithoutCamera

  const headerStyle: ViewStyle = {
    ...headerCameraBasedStyle,
    ...styles.absolute,
    top: safeAreaInsets.top,
  }

  const iconColor = (isShowingCamera || isDark) ? 'white' : 'black'


  return (
    <Appbar.Header style={headerStyle}>
      <Appbar.BackAction
        iconColor={iconColor}
        onPress={goBack}
      />

      <Appbar.Content title={''} />

      <Appbar.Action
        icon={'cog'}
        iconColor={iconColor}
        onPress={openCameraSettings}
        disabled={isHeaderActionDisabled}
      />
    </Appbar.Header>
  )
}
