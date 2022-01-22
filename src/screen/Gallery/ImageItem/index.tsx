import React, { useCallback, useEffect, useState } from "react"
import { Image, useWindowDimensions } from "react-native"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"

import { Icon } from "../../../components"
import { useColorTheme } from "../../../services/theme"
import { Button, SelectionSurface } from "./style"


export interface ImageItemProps {
    click: () => void;
    select: () => void;
    deselect: () => void;
    selectionMode: boolean;
    imagePath: string;
    screenAction: "replace-picture" | undefined;
}


export const ImageItem = (props: ImageItemProps) => {


    const { color } = useColorTheme()

    const [selected, setSelected] = useState(false)
    const imageSize = useWindowDimensions().width / 3


    const normalPress = useCallback(() => {
        if (!props.selectionMode) {
            props.click()
        } else if (!selected) {
            props.select()
            setSelected(true)
        } else if (selected) {
            props.deselect()
            setSelected(false)
        }
    }, [props.selectionMode, selected, props.click])

    const longPress = useCallback((nativeEvent) => {
        if (nativeEvent.state === State.ACTIVE && props.screenAction === undefined) {
            if (!props.selectionMode) {
                props.select()
                setSelected(true)
            }
        }
    }, [props.selectionMode])


    useEffect(() => {
        if (!props.selectionMode && selected) {
            setSelected(false)
        }
    }, [props.selectionMode])


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <Button
                onPress={normalPress}
                style={{ width: imageSize }}
            >
                <Image
                    source={{ uri: `file://${props.imagePath}` }}
                    style={{ width: imageSize, aspectRatio: 1 }}
                />

                {props.selectionMode && selected && (
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
