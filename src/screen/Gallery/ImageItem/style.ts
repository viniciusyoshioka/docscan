import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet(theme => ({
  imageItemButton: {
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  },
  selectionSurface: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    opacity: 0.6,
  },
}))
