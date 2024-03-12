import { View, useWindowDimensions } from "react-native"
import FastImage from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Icon, Pressable } from "react-native-paper-towel"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"
import { useStyles } from "react-native-unistyles"

import { useAppTheme } from "@theme"
import { PICTURE_BUTTON_MARGIN, stylesheet } from "./style"


export const VERTICAL_COLUMN_COUNT = 2
export const HORIZONTAL_COLUMN_COUNT = 4


export function getPictureItemSize(windowWidth: number, columnCount: number): number {
    const singlePictureItemMarginWidth = (2 * PICTURE_BUTTON_MARGIN)
    const pictureItemRowWidth = windowWidth - singlePictureItemMarginWidth
    return (pictureItemRowWidth / columnCount) - singlePictureItemMarginWidth
}


export interface PictureItemProps extends SelectableItem {
    picturePath: string
    columnCount: number
}


export function PictureItem(props: PictureItemProps) {


    const { width } = useWindowDimensions()
    const { colors } = useAppTheme()
    const { styles } = useStyles(stylesheet)
    const { onPress, onLongPress } = useSelectableItem(props)

    const pictureItemSize = getPictureItemSize(width, props.columnCount)


    const longPressGesture = Gesture.LongPress()
        .maxDistance(30)
        .minDuration(400)
        .onStart(event => runOnJS(onLongPress)())


    return (
        <GestureDetector gesture={longPressGesture}>
            <Pressable
                style={styles.pictureButton(pictureItemSize)}
                onPress={onPress}
                android_ripple={{ color: colors.primary, foreground: true }}
            >
                <FastImage
                    source={{ uri: `file://${props.picturePath}` }}
                    style={styles.pictureImage}
                />

                {props.isSelectionMode && props.isSelected && <>
                    <View style={styles.selectedSurface} />

                    <Icon
                        name={"check"}
                        size={32}
                        color={colors.onPrimary}
                        style={{ position: "absolute" }}
                    />
                </>}
            </Pressable>
        </GestureDetector>
    )
}
