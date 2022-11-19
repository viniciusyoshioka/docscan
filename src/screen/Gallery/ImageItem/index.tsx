import React from "react"
import { Image, useWindowDimensions } from "react-native"
import { HandlerStateChangeEventPayload, LongPressGestureHandler, LongPressGestureHandlerEventPayload, State } from "react-native-gesture-handler"

import { Icon } from "../../../components"
import { useAppTheme } from "../../../services/theme"
import { Button, SelectionSurface } from "./style"


export interface ImageItemProps {
    onClick: () => void;
    onSelected: () => void;
    onDeselected: () => void;
    isSelectionMode: boolean;
    isSelected: boolean;
    imagePath: string;
    screenAction: "replace-picture" | undefined;
}


export function ImageItem(props: ImageItemProps) {


    const { color } = useAppTheme()

    const imageSize = useWindowDimensions().width / 3


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
