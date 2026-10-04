import Color from 'color'
import { useCallback } from 'react'
import { Pressable } from 'react-native'
import { Text } from 'react-native-paper'
import type { IconNames } from 'react-native-paper-towel'
import { Icon } from 'react-native-paper-towel'
import { createAnimatedComponent, useAnimatedStyle } from 'react-native-reanimated'

import { useAppTheme } from '@theme'
import { useAnimatedRotationDegree } from '../../../../hooks'
import { ACTION_BUTTON_SIZE } from './action-button.constants.ts'
import { styles } from './action-button.styles.ts'


const BUTTON_RADIUS = ACTION_BUTTON_SIZE / 2
const AnimatedPressable = createAnimatedComponent(Pressable)


interface ActionButtonProps {
  isShowingCamera: boolean
  icon?: IconNames
  counter?: string
  isDisabled?: boolean
  onPress?: () => void
}


export function ActionButton(props: ActionButtonProps) {
  const { isShowingCamera, icon, counter, isDisabled, onPress } = props


  const { colors, state, typography } = useAppTheme()


  const colorStyle = isShowingCamera ? 'white' : colors.onBackground
  const contentColor = isDisabled
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
    if (icon === undefined) return null

    return (
      <Icon
        name={icon}
        color={contentColor}
      />
    )
  }, [icon, contentColor])

  const CounterText = useCallback(() => {
    if (counter === undefined) return null

    return (
      <Text
        style={[
          typography.body.large,
          { color: contentColor },
        ]}
        children={counter}
      />
    )
  }, [counter, contentColor, typography.body.large])


  const animatedRotation = useAnimatedRotationDegree()
  const orientationStyle = useAnimatedStyle(() => ({
    ...styles.actionButton,
    transform: [
      { rotate: `${animatedRotation.value}deg` },
    ],
  }))


  return (
    <AnimatedPressable
      android_ripple={{ color: rippleColor, radius: BUTTON_RADIUS }}
      disabled={isDisabled}
      onPress={onPress}
      style={orientationStyle}
    >
      <ButtonIcon />

      <CounterText />
    </AnimatedPressable>
  )
}
