import { useMemo } from "react"
import { Image, useWindowDimensions } from "react-native"
import { HandlerStateChangeEventPayload, LongPressGestureHandler, LongPressGestureHandlerEventPayload, State } from "react-native-gesture-handler"

import { Icon } from "../../../components"
import { useAppTheme } from "../../../services/theme"
import { Button, SelectionSurface } from "./style"


/**
 * Amount of columns to be shown when the window is vertical
 */
export const VERTICAL_COLUMN_COUNT = 3

/**
 * Amount of columns to be shown when the window is horizontal
 */
export const HORIZONTAL_COLUMN_COUNT = 6

/**
 * Function that calculates the size of ImageItem and returns it
 *
 * @param windowWidth width of app's window
 * @param columnCount amount of columns that are being shown in ImageItem's list
 *
 * @returns number of ImageItem's size
 */
export function getImageItemSize(windowWidth: number, columnCount: number): number {
    return (windowWidth / columnCount)
}


export interface ImageItemProps {
    onClick: () => void;
    onSelected: () => void;
    onDeselected: () => void;
    isSelectionMode: boolean;
    isSelected: boolean;
    imagePath: string;
    screenAction: "replace-picture" | undefined;
    columnCount: number;
}


export function ImageItem(props: ImageItemProps) {


    const { width } = useWindowDimensions()

    const { color } = useAppTheme()

    const imageSize = useMemo(() => getImageItemSize(width, props.columnCount), [width, props.columnCount])


    function onNormalPress() {
        if (!props.isSelectionMode) {
            props.onClick()
        } else if (!props.isSelected) {
            props.onSelected()
        } else if (props.isSelected) {
            props.onDeselected()
        }
    }

    function onLongPress(nativeEvent: Readonly<HandlerStateChangeEventPayload & LongPressGestureHandlerEventPayload>) {
        if (nativeEvent.state === State.ACTIVE && props.screenAction === undefined) {
            if (!props.isSelectionMode) {
                props.onSelected()
            }
        }
    }


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onLongPress(nativeEvent)}
        >
            <Button
                onPress={onNormalPress}
                style={{ width: imageSize }}
            >
                <Image
                    source={{ uri: `file://${props.imagePath}` }}
                    style={{ width: imageSize, aspectRatio: 1 }}
                />

                {props.isSelectionMode && props.isSelected && (
                    <>
                        <SelectionSurface />

                        <Icon
                            iconName={"done"}
                            iconSize={30}
                            iconColor={color.imageItem_selected_color}
                            iconStyle={{ position: "absolute" }}
                        />
                    </>
                )}
            </Button>
        </LongPressGestureHandler>
    )
}
