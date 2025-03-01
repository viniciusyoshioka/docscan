import { StyleSheet } from "react-native"

import { ACTION_BUTTON_SIZE } from "./constants"


export const styles = StyleSheet.create({
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: ACTION_BUTTON_SIZE,
    height: ACTION_BUTTON_SIZE,
  },
})
