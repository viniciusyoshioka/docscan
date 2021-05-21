import React, { useCallback, useEffect, useState } from "react"
import { Image, useWindowDimensions } from "react-native"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/Ionicons"

import { useTheme } from "../../service/theme"
import { Button, SelectionSurface } from "./style"


export interface ImageItemProps {
    click: () => void,
    select: () => void,
    deselect: () => void,
    selectionMode: boolean,
    imagePath: string,
    screenAction: "replace-picture" | undefined,
}


export function ImageItem(props: ImageItemProps) {


    const { color } = useTheme()

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
            <Button onPress={normalPress}>
                <Image
                    source={{ uri: `file://${props.imagePath}` }}
                    style={{
                        width: imageSize, height: imageSize,
                    }}
                />

                {props.selectionMode && selected && (
                    <SelectionSurface>
                        <Icon
                            name={"md-checkmark"}
                            size={30}
                            color={color.imageItem_selected_color}
                        />
                    </SelectionSurface>
                )}
            </Button>
        </LongPressGestureHandler>
    )
}
