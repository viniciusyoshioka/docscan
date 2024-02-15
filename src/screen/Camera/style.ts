import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet(theme => ({
    cameraTextWrapper: {
        flex: 1,
        padding: 16,
    },
    cameraButtonWrapper: {
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        paddingBottom: 0,
        gap: 8,
    },
    cameraWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    cameraMessageTitle: {
        width: "100%",
        marginBottom: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: theme.colors.onBackground,
    },
    cameraMessageText: {
        marginBottom: 4,
        color: theme.colors.onBackground,
    },
}))
