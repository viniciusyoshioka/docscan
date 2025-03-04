import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  errorContainer: {
    width: "100%",
    padding: 16,
    gap: 16,
    backgroundColor: theme.colors.errorContainer,
    borderRadius: theme.shape.large,
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
