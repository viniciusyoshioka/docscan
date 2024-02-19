import { Icon } from "@elementium/native"
import { useMemo } from "react"
import { Pressable, View, useWindowDimensions } from "react-native"
import FastImage from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"
import { useStyles } from "react-native-unistyles"

import { ScreenAction } from "@router"
import { useAppTheme } from "@theme"
import { stylesheet } from "./style"


export const VERTICAL_COLUMN_COUNT = 4
export const HORIZONTAL_COLUMN_COUNT = 7


export function getImageItemSize(windowWidth: number, columnCount: number): number {
    return (windowWidth / columnCount)
}


export interface ImageItemProps extends SelectableItem {
    imagePath: string
    screenAction: ScreenAction
    columnCount: number
}


export function ImageItem(props: ImageItemProps) {


    const { width } = useWindowDimensions()
    const { styles } = useStyles(stylesheet)

    const { color } = useAppTheme()
    const { onPress, onLongPress } = useSelectableItem(props)

    const imageSize = useMemo(() => getImageItemSize(width, props.columnCount), [width, props.columnCount])


    const longPressGesture = Gesture.LongPress()
        .maxDistance(30)
        .minDuration(400)
        .onStart(event => {
            if (props.screenAction === "replace-picture") return
            runOnJS(onLongPress)()
        })


    return (
        <GestureDetector gesture={longPressGesture}>
            <Pressable
                onPress={onPress}
                style={[styles.imageItemButton, { width: imageSize } ]}
            >
                <FastImage
                    source={{ uri: `file://${props.imagePath}` }}
                    style={{ width: imageSize, aspectRatio: 1 }}
                />

                {props.isSelectionMode && props.isSelected && <>
                    <View style={styles.selectionSurface} />

                    <Icon
                        name={"check"}
                        size={32}
                        color={color.onPrimary}
                        style={{ position: "absolute" }}
                    />
                </>}
            </Pressable>
        </GestureDetector>
    )
}
