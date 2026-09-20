import type { StyleProp, ViewStyle } from 'react-native'
import { ActivityIndicator, StyleSheet } from 'react-native'
import type { AnimatedStyle } from 'react-native-reanimated'
import Reanimated from 'react-native-reanimated'

import { useAppTheme } from '@theme'


interface LoadingOverlayProps {
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
}


export function LoadingOverlay(props: LoadingOverlayProps) {


  const { colors, isDark } = useAppTheme()

  const overlayColor = isDark
    ? 'rgba(0, 0, 0, 0.4)'
    : 'rgba(255, 255, 255, 0.4)'


  return (
    <Reanimated.View
      style={[
        styles.wrapper,
        { backgroundColor: overlayColor },
        props.style,
      ]}
    >
      <ActivityIndicator
        size={'large'}
        color={colors.onBackground}
      />
    </Reanimated.View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
