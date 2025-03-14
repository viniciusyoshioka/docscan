import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet({
  absolute: (headerColor: string) => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: headerColor,
    elevation: 0,
    zIndex: 1,
  }),
  relative: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    elevation: 0,
    zIndex: 1,
  },
})
