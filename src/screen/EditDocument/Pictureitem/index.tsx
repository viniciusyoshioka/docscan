import { Color } from "@elementium/color"
import { Icon } from "@elementium/native"
import { useMemo } from "react"
import { useWindowDimensions } from "react-native"
import { LongPressGestureHandler } from "react-native-gesture-handler"

import { SelectableItem, useSelectableItem } from "@hooks"
import { useAppTheme } from "@theme"
import { PICTURE_BUTTON_MARGIN, PictureButton, PictureImage, SelectedSurface } from "./style"


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

    const { color } = useAppTheme()
    const { onPress, onLongPress } = useSelectableItem(props)

    const pictureItemSize = useMemo(() => getPictureItemSize(width, props.columnCount), [width, props.columnCount])

    const rippleColor = new Color(color.primary).setA(0.5).toRgba()


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onLongPress(nativeEvent)}
        >
            <PictureButton
                style={{ maxWidth: pictureItemSize }}
                onPress={onPress}
                android_ripple={{ color: rippleColor, foreground: true }}
            >
                <PictureImage source={{ uri: `file://${props.picturePath}` }} />

                {props.isSelectionMode && props.isSelected && <>
                    <SelectedSurface />

                    <Icon
                        name={"done"}
                        size={32}
                        color={color.onPrimary}
                        style={{ position: "absolute" }}
                    />
                </>}
            </PictureButton>
        </LongPressGestureHandler>
    )
}
