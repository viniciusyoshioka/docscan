import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet(theme => ({
  textContainer: {
    flex: 1,
    padding: 24,
  },
  messageTitle: {
    marginBottom: 24,
    textAlign: "center",
    color: theme.colors.onBackground,
    ...theme.typography.title.large,
    fontWeight: "bold",
  },
  messageText: {
    marginBottom: 8,
    color: theme.colors.onBackground,
    ...theme.typography.body.large,
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 0,
    gap: 8,
  },
}))
