import Color from "color"
import { useCallback } from "react"
import { useMaterialTheme } from "react-material-design-provider"
import { GestureResponderEvent, TouchableOpacity } from "react-native"
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { styles } from "./styles"


export * from "./constants"


const AnimatedTouchableOpacity = Reanimated.createAnimatedComponent(TouchableOpacity)


interface CaptureButtonProps {
  isShowingCamera: boolean
  isDisabled?: boolean
  onPress?: () => void
}


export function CaptureButton(props: CaptureButtonProps) {


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

    if (props.onPress) props.onPress()
  }, [props.onPress])


  const enabledBackgroundColor = props.isShowingCamera ? "white" : colors.onBackground
  const disabledBackgroundColor = Color(enabledBackgroundColor)
    .alpha(state.disabled)
    .rgb()
    .toString()

  const backgroundColor = props.isDisabled ? disabledBackgroundColor : enabledBackgroundColor

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
      disabled={props.isDisabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={animatedScale}
    />
  )
}
