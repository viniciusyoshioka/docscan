import { StyleSheet } from "react-native"

import { FOCUS_INDICATOR_SIZE } from "./constants"


export const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: FOCUS_INDICATOR_SIZE,
    height: FOCUS_INDICATOR_SIZE,
    borderRadius: FOCUS_INDICATOR_SIZE,
    borderWidth: 1,
    borderColor: "white",
  },
})
