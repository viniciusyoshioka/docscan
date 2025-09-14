import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"
import { Text } from "react-native-paper"
import { Icon, IconNames } from "react-native-paper-towel"
import Reanimated, { useAnimatedStyle } from "react-native-reanimated"

import { useAnimatedRotationDegree } from "../../../../hooks"
import { styles } from "./styles"


export * from "./constants"


const AnimatedTouchableOpacity = Reanimated.createAnimatedComponent(TouchableOpacity)


interface SettingsButtonProps extends TouchableOpacityProps {
  icon: IconNames
  optionName: string
  isVisible?: boolean
  isDisabled?: boolean
}


export function SettingsButton(props: SettingsButtonProps) {
  const { icon, optionName, isVisible = true, isDisabled = false, style = [] } = props


  const styleProps = StyleSheet.flatten(style)


  const animatedRotationDegree = useAnimatedRotationDegree()
  const orientationStyle = useAnimatedStyle(() => ({
    ...styles.container,
    ...styleProps,
    transform: [
      { rotate: `${animatedRotationDegree.value}deg` },
    ],
  }))

  const color = isDisabled ? "gray" : "white"


  if (!isVisible) {
    return null
  }


  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.6}
      {...props}
      disabled={isDisabled}
      style={orientationStyle}
    >
      <Icon
        name={icon}
        color={color}
        style={{ flex: 1 }}
      />

      <Text
        variant={"labelMedium"}
        numberOfLines={2}
        style={{ flex: 1, color, textAlign: "center" }}
        children={optionName}
      />
    </AnimatedTouchableOpacity>
  )
}
