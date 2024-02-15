import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet(theme => ({
    compressionText: (disabled: boolean) => ({
        width: 40,
        textAlign: "left",
        textAlignVertical: "center",
        color: theme.colors.onSurface,
        opacity: disabled ? theme.state.content.disabled : 1,
    }),
    viewSlider: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        height: 56,
        marginHorizontal: 24,
    },
}))
