import { createStyleSheet } from "react-native-unistyles"


export const PICTURE_BUTTON_MARGIN = 4


export const stylesheet = createStyleSheet(theme => ({
    pictureButton: (pictureItemSize: number) => ({
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        maxWidth: pictureItemSize,
        margin: PICTURE_BUTTON_MARGIN,
        borderRadius: theme.shape.small,
        aspectRatio: 1,
        overflow: "hidden",
    }),
    pictureImage: {
        flex: 1,
        borderRadius: theme.shape.small,
        resizeMode: "cover",
        aspectRatio: 1,
    },
    selectedSurface: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: theme.shape.small,
        backgroundColor: theme.colors.primary,
        opacity: 0.5,
    },
}))
