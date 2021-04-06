import CheckBox from "@react-native-community/checkbox"
import React, { useCallback, useEffect, useState } from "react"
import { Animated, Dimensions, Image } from "react-native"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"

import { useTheme } from "../../service/theme"
import { Button, CheckboxBackground, ViewCheckBox } from "./style"


export interface ImageItemProps {
    click: () => void,
    select: () => void,
    deselect: () => void,
    selectionMode: boolean,
    imagePath: string,
}


export function ImageItem(props: ImageItemProps) {


    const { color } = useTheme()

    const [selected, setSelected] = useState(false)
    const [imageSize, setImageSize] = useState(Dimensions.get("window").width / 3)
    const animatedOpacity = new Animated.Value(0)


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
        if (nativeEvent.state === State.ACTIVE) {
            if (!props.selectionMode) {
                props.select()
                setSelected(true)
            }
        }
    }, [props.selectionMode])


    useEffect(() => {
        if (props.selectionMode) {
            Animated.sequence([
                Animated.timing(animatedOpacity, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: false
                })
            ]).start()
        } else if (!props.selectionMode) {
            if (!selected) {
                Animated.sequence([
                    Animated.timing(animatedOpacity, {
                        toValue: 0,
                        duration: 50,
                        useNativeDriver: false
                    })
                ]).start()
            } else {
                setSelected(false)
            }
        }
    }, [props.selectionMode])

    useEffect(() => {
        if (!props.selectionMode && !selected) {
            Animated.sequence([
                Animated.timing(animatedOpacity, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: false
                })
            ]).start()
        }
    }, [selected])

    useEffect(() => {
        Dimensions.addEventListener(
            "change", 
            ({ window }) => setImageSize(window.width / 3)
        )

        return () => {
            Dimensions.removeEventListener(
                "change", 
                ({ window }) => setImageSize(window.width / 3)
            )
        }
    }, [])


    return (
        <LongPressGestureHandler 
            maxDist={30} 
            minDurationMs={800} 
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <Button onPress={normalPress}>
                <Image
                    source={{uri: `file://${props.imagePath}`}}
                    style={{
                        width: imageSize, height: imageSize,
                    }}
                />

                <Animated.View style={[ViewCheckBox, {opacity: props.selectionMode ? 1 : animatedOpacity}]}>
                    <CheckboxBackground />

                    <CheckBox
                        value={selected}
                        onValueChange={normalPress}
                        tintColors={{
                            true: color.color,
                            false: color.color
                        }}
                    />
                </Animated.View>
            </Button>
        </LongPressGestureHandler>
    )
}
