import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet(theme => ({
  textContainer: {
    flex: 1,
    padding: 24,
  },
  permissionMessageTitle: {
    marginBottom: 16,
    color: theme.colors.onBackground,
    textAlign: "center",
    ...theme.typography.title.large,
    fontWeight: "bold",
  },
  permissionMessageDescription: {
    marginBottom: 16,
    color: theme.colors.onBackground,
    textAlign: "justify",
    ...theme.typography.body.large,
  },
  permissionMessageTopic: {
    marginBottom: 8,
    color: theme.colors.onBackground,
    ...theme.typography.body.large,
  },

  buttonContainer: {
    padding: 24,
    gap: 8,
  },
}))
