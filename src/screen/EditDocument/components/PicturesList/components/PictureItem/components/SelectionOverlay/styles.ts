import Color from "color"
import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet(theme => ({
  selectionOverlay: (isSelected: boolean) => {
    const opacity = isSelected ? 1 : 0
    const backgroundColor = Color(theme.colors.primary)
      .alpha(0.5)
      .rgb()
      .toString()

    return {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor,
      opacity,
    }
  },
}))
