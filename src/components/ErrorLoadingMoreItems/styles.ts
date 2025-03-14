import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet(theme => ({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    maxWidth: 360,
    backgroundColor: theme.colors.errorContainer,
    borderRadius: theme.shape.large,
    margin: 16,
    padding: 16,
    gap: 8,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    color: theme.colors.onErrorContainer,
  },

  text: {
    color: theme.colors.onErrorContainer,
  },
}))
