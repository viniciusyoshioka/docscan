import Color from 'color'
import { useCallback } from 'react'
import { useMaterialTheme } from 'react-material-design-provider'
import type { GestureResponderEvent } from 'react-native'
import { TouchableOpacity } from 'react-native'
import {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { styles } from './capture-button.styles.ts'


const AnimatedTouchableOpacity = createAnimatedComponent(TouchableOpacity)


interface CaptureButtonProps {
  isShowingCamera: boolean
  isDisabled?: boolean
  onClick?: () => void
}


export function CaptureButton(props: CaptureButtonProps) {
  const { isShowingCamera, isDisabled, onClick } = props


  const { colors, state } = useMaterialTheme()

  const newScale = useSharedValue(1)


  const onPressIn = useCallback((e: GestureResponderEvent) => {
    newScale.value = withTiming(0.85, { duration: 150 })
  }, [])

  const onPressOut = useCallback((e: GestureResponderEvent) => {
    newScale.value = withTiming(1, { duration: 150 })
  }, [])

  const onPress = useCallback((e: GestureResponderEvent) => {
    newScale.value = withTiming(0.85, { duration: 75 }, () => {
      newScale.value = withTiming(1, { duration: 75 })
    })

    if (onClick) onClick()
  }, [onClick])


  const enabledBackgroundColor = isShowingCamera
    ? 'white'
    : colors.onBackground
  const disabledBackgroundColor = Color(enabledBackgroundColor)
    .alpha(state.disabled)
    .rgb()
    .toString()

  const backgroundColor = isDisabled
    ? disabledBackgroundColor
    : enabledBackgroundColor

  const animatedScale = useAnimatedStyle(() => ({
    ...styles.captureButton,
    backgroundColor,
    transform: [
      { scale: newScale.value },
    ],
  }))


  return (
    <AnimatedTouchableOpacity
      activeOpacity={1}
      disabled={isDisabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={animatedScale}
    />
  )
}
