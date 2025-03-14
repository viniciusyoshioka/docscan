import { ActivityIndicator, StyleProp, StyleSheet, ViewStyle } from "react-native"
import Reanimated, { AnimatedStyle } from "react-native-reanimated"

import { useAppTheme } from "@theme"


export interface LoadingOverlayProps {
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
}


export function LoadingOverlay(props: LoadingOverlayProps) {


  const { colors, isDark } = useAppTheme()

  const overlayColor = isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)"


  return (
    <Reanimated.View
      style={[
        styles.wrapper,
        { backgroundColor: overlayColor },
        props.style,
      ]}
    >
      <ActivityIndicator
        size={"large"}
        color={colors.onBackground}
      />
    </Reanimated.View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
})
