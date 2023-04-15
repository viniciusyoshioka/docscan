import { Icon } from "@elementium/native"
import { useMemo } from "react"
import { useWindowDimensions } from "react-native"
import FastImage from "react-native-fast-image"
import { LongPressGestureHandler } from "react-native-gesture-handler"

import { SelectableItem, useSelectableItem } from "../../../hooks"
import { useAppTheme } from "../../../theme"
import { Button, SelectionSurface } from "./style"


export const VERTICAL_COLUMN_COUNT = 4
export const HORIZONTAL_COLUMN_COUNT = 7


export function getImageItemSize(windowWidth: number, columnCount: number): number {
    return (windowWidth / columnCount)
}


export interface ImageItemProps extends SelectableItem {
    imagePath: string;
    screenAction: "replace-picture" | undefined;
    columnCount: number;
}


export function ImageItem(props: ImageItemProps) {


    const { width } = useWindowDimensions()

    const { color } = useAppTheme()
    const { onPress, onLongPress } = useSelectableItem(props)

    const imageSize = useMemo(() => getImageItemSize(width, props.columnCount), [width, props.columnCount])


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onLongPress(nativeEvent)}
        >
            <Button onPress={onPress} style={{ width: imageSize }}>
                <FastImage
                    source={{ uri: `file://${props.imagePath}` }}
                    style={{ width: imageSize, aspectRatio: 1 }}
                />

                {props.isSelectionMode && props.isSelected && <>
                    <SelectionSurface />

                    <Icon
                        name={"done"}
                        size={32}
                        color={color.onPrimary}
                        style={{ position: "absolute" }}
                    />
                </>}
            </Button>
        </LongPressGestureHandler>
    )
}
