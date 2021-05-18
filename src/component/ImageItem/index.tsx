import React, { useCallback, useEffect, useState } from "react"
import { Image, useWindowDimensions } from "react-native"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"
import CheckBox from "@react-native-community/checkbox"

import { useTheme } from "../../service/theme"
import { Button, CheckboxBackground, ViewCheckBox } from "./style"


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
            minDurationMs={350} 
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <Button onPress={normalPress}>
                <Image
                    source={{uri: `file://${props.imagePath}`}}
                    style={{
                        width: imageSize, height: imageSize,
                    }}
                />

                {props.selectionMode && (
                    <ViewCheckBox>
                        <CheckboxBackground />

                        <CheckBox
                            value={selected}
                            onValueChange={normalPress}
                            tintColors={{
                                true: color.checkBox_checked_color,
                                false: color.checkBox_unchecked_color
                            }}
                        />
                    </ViewCheckBox>
                )}
            </Button>
        </LongPressGestureHandler>
    )
}
