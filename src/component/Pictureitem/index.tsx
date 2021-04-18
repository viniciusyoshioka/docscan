import React, { useCallback, useEffect, useState } from "react"
import { Animated } from "react-native"
import CheckBox from "@react-native-community/checkbox"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"

import { CheckboxBackground, CheckBoxView, FileNameText, FileNameView, PictureButton, PictureImage } from "./style"
import { useTheme } from "../../service/theme"


export interface PictureItemProps {
    click: () => void,
    select: () => void,
    deselect: () => void,
    selectionMode: boolean,
    picturePath: string,
}


export function PictureItem(props: PictureItemProps) {


    const { color } = useTheme()

    const [selected, setSelected] = useState(false)
    const animatedOpacity = new Animated.Value(0)


    const getPictureName = useCallback(() => {
        const splittedPath = props.picturePath.split("/")
        return splittedPath[splittedPath.length - 1]
    }, [props.picturePath])

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


    return (
        <LongPressGestureHandler
            maxDist={30} 
            minDurationMs={800} 
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <PictureButton style={{aspectRatio: 2/3}} onPress={normalPress}>
                <PictureImage 
                    source={{uri: `file://${props.picturePath}`}} 
                    style={{aspectRatio: 2/3}}
                />

                <FileNameView>
                    <FileNameText numberOfLines={1}>
                        {getPictureName()}
                    </FileNameText>
                </FileNameView>

                <Animated.View style={[CheckBoxView, {opacity: animatedOpacity}]}>
                    <CheckboxBackground />

                    <CheckBox 
                        value={selected}
                        onChange={normalPress}
                        tintColors={{
                            true: color.color,
                            false: color.color
                        }}
                    />
                </Animated.View>
            </PictureButton>
        </LongPressGestureHandler>
    )
}
