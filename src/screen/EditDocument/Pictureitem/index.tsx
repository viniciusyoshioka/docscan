import React, { useMemo } from "react"
import { useWindowDimensions } from "react-native"
import { HandlerStateChangeEventPayload, LongPressGestureHandler, LongPressGestureHandlerEventPayload, State } from "react-native-gesture-handler"

import { Icon } from "../../../components"
import { useAppTheme } from "../../../services/theme"
import { PictureButton, PictureImage, PICTURE_BUTTON_MARGIN, SelectedSurface } from "./style"


export interface PictureItemProps {
    onClick: () => void;
    onSelected: () => void;
    onDeselected: () => void;
    isSelectionMode: boolean;
    isSelected: boolean;
    picturePath: string;
}


export function PictureItem(props: PictureItemProps) {


    const { width } = useWindowDimensions()

    const { color } = useAppTheme()

    const pictureItemSize = useMemo(() => {
        const singlePictureItemMarginWidth = (2 * PICTURE_BUTTON_MARGIN)
        const pictureItemRowWidth = width - singlePictureItemMarginWidth
        return (pictureItemRowWidth / 2) - singlePictureItemMarginWidth
    }, [width])


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
