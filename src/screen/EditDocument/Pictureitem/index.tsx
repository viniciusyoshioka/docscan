import { Icon } from "@elementium/native"
import { useMemo } from "react"
import { useWindowDimensions } from "react-native"
import { LongPressGestureHandler } from "react-native-gesture-handler"

import { SelectableItem, useSelectableItem } from "../../../hooks"
import { useAppTheme } from "../../../theme"
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


export interface PictureItemProps extends SelectableItem {
    picturePath: string;
    columnCount: number;
}


export function PictureItem(props: PictureItemProps) {


    const { width } = useWindowDimensions()

    const { color } = useAppTheme()

    const pictureItemSize = useMemo(() => getPictureItemSize(width, props.columnCount), [width, props.columnCount])

    const { onPress, onLongPress } = useSelectableItem(props)


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onLongPress(nativeEvent)}
        >
            <PictureButton
                style={{ maxWidth: pictureItemSize }}
                onPress={onPress}
            >
                <PictureImage source={{ uri: `file://${props.picturePath}` }} />

                {props.isSelectionMode && props.isSelected && (
                    <>
                        <SelectedSurface />

                        <Icon
                            name={"done"}
                            size={30}
                            color={color.onPrimary}
                            style={{ position: "absolute" }}
                        />
                    </>
                )}
            </PictureButton>
        </LongPressGestureHandler>
    )
}
