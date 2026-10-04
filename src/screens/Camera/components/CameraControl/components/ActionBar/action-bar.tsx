import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import { StyleSheet, View } from 'react-native'

import { styles } from './action-bar.styles.ts'


interface ActionBarProps extends PropsWithChildren {
  isShowingCamera: boolean
  cameraControlStyle: ViewStyle
}


export function ActionBar(props: ActionBarProps) {
  const { isShowingCamera, cameraControlStyle, children } = props


  const actionBarBackgroundStyle = useMemo<ViewStyle>(() => ({
    backgroundColor: isShowingCamera ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
  }), [isShowingCamera])

  const wrapperStyle = useMemo(() => {
    return StyleSheet.flatten([
      styles.wrapper,
      actionBarBackgroundStyle,
      cameraControlStyle,
    ])
  }, [actionBarBackgroundStyle, cameraControlStyle])


  return <View style={wrapperStyle} children={children} />
}
