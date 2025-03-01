import Color from "color"
import { useCallback } from "react"
import { Pressable } from "react-native"
import { Text } from "react-native-paper"
import { Icon } from "react-native-paper-towel"
import Reanimated, { useAnimatedStyle } from "react-native-reanimated"

import { useAppTheme } from "@theme"
import { useAnimatedRotationDegree } from "../../../../hooks"
import { ACTION_BUTTON_SIZE } from "./constants"
import { styles } from "./styles"


export * from "./constants"


const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable)


interface ActionButtonProps {
  isShowingCamera: boolean
  icon?: string
  counter?: string
  isDisabled?: boolean
  onPress?: () => void
}


export function ActionButton(props: ActionButtonProps) {


  const { colors, state, typography } = useAppTheme()


  const colorStyle = props.isShowingCamera ? "white" : colors.onBackground
  const contentColor = props.isDisabled
    ? Color(colorStyle)
        .alpha(state.disabled)
        .rgb()
        .toString()
    : colorStyle
  const rippleColor = Color(colorStyle)
    .alpha(state.press)
    .rgb()
    .toString()


  const ButtonIcon = useCallback(() => {
    if (props.icon === undefined) return null

    return (
      <Icon
        name={props.icon}
        group={"material-community"}
        color={contentColor}
      />
    )
  }, [props.icon, contentColor])

  const CounterText = useCallback(() => {
    if (props.counter === undefined) return null

    return (
      <Text
        style={[
          typography.body.large,
          { color: contentColor },
        ]}
        children={props.counter}
      />
    )
  }, [props.counter, contentColor, typography.body.large])


  const animatedRotation = useAnimatedRotationDegree()
  const orientationStyle = useAnimatedStyle(() => ({
    ...styles.actionButton,
    transform: [
      { rotate: `${animatedRotation.value}deg` },
    ],
  }))


  return (
    <AnimatedPressable
      android_ripple={{ color: rippleColor, radius: ACTION_BUTTON_SIZE / 2 }}
      disabled={props.isDisabled}
      onPress={props.onPress}
      style={orientationStyle}
    >
      <ButtonIcon />

      <CounterText />
    </AnimatedPressable>
  )
}
