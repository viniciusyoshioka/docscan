import { Icon } from "@elementium/native"
import { useMemo } from "react"
import { Pressable, View, useWindowDimensions } from "react-native"
import FastImage from "react-native-fast-image"
import { HandlerStateChangeEventPayload, LongPressGestureHandler, LongPressGestureHandlerEventPayload } from "react-native-gesture-handler"
import { useStyles } from "react-native-unistyles"

import { SelectableItem, useSelectableItem } from "@hooks"
import { ScreenAction } from "@router"
import { useAppTheme } from "@theme"
import { stylesheet } from "./style"


type LongPressNativeEventType = Readonly<HandlerStateChangeEventPayload & LongPressGestureHandlerEventPayload>


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


    function onItemLongPress(nativeEvent: LongPressNativeEventType) {
        if (props.screenAction === "replace-picture") return
        onLongPress(nativeEvent)
    }


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onItemLongPress(nativeEvent)}
        >
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
        </LongPressGestureHandler>
    )
}
