import React, { useMemo } from "react"
import { useWindowDimensions } from "react-native"
import { HandlerStateChangeEventPayload, LongPressGestureHandler, LongPressGestureHandlerEventPayload, State } from "react-native-gesture-handler"

import { Icon } from "../../../components"
import { useAppTheme } from "../../../services/theme"
import { PictureButton, PictureImage, PICTURE_BUTTON_MARGIN, SelectedSurface } from "./style"


/**
 * Amount of columns to be shown when the windows is vertical
 */
export const VERTICAL_COLUMN_COUNT = 2

/**
 * Amount of columns to be shown when the windows is horizontal
 */
export const HORIZONTAL_COLUMN_COUNT = 4

/**
 * Function that calculates the size of PictureItem and returns it
 *
 * @param windowWidth width of app's window
 * @param columnCount amount of columns that are being shown in PictureItem's list
 *
 * @returns number of PictureItem's size
 */
export function getPictureItemSize(windowWidth: number, columnCount: number): number {
    const singlePictureItemMarginWidth = (2 * PICTURE_BUTTON_MARGIN)
    const pictureItemRowWidth = windowWidth - singlePictureItemMarginWidth
    return (pictureItemRowWidth / columnCount) - singlePictureItemMarginWidth
}


export interface PictureItemProps {
    onClick: () => void;
    onSelected: () => void;
    onDeselected: () => void;
    isSelectionMode: boolean;
    isSelected: boolean;
    picturePath: string;
    columnCount: number;
}


export function PictureItem(props: PictureItemProps) {


    const { width } = useWindowDimensions()

    const { color } = useAppTheme()

    const pictureItemSize = useMemo(() => getPictureItemSize(width, props.columnCount), [width, props.columnCount])


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
        if (nativeEvent.state === State.ACTIVE) {
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
            <PictureButton
                style={{ maxWidth: pictureItemSize }}
                onPress={onNormalPress}
            >
                <PictureImage source={{ uri: `file://${props.picturePath}` }} />

                {props.isSelectionMode && props.isSelected && (
                    <>
                        <SelectedSurface />

                        <Icon
                            iconName={"done"}
                            iconSize={30}
                            iconColor={color.pictureItem_selected_color}
                            iconStyle={{ position: "absolute" }}
                        />
                    </>
                )}
            </PictureButton>
        </LongPressGestureHandler>
    )
}
