import React, { useCallback, useContext, useEffect, useState } from "react"
import { Animated } from "react-native"
import CheckBox from "@react-native-community/checkbox"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"

import { CheckBoxView, FileNameText, FileNameView, PictureButton, PictureImage } from "./style"
import { ThemeContext } from "../../service/theme"


export interface PictureItemProps {
    click: () => void,
    select: () => void,
    deselect: () => void,
    selectionMode: boolean,
    picturePath: string,
}


export default function PictureItem(props: PictureItemProps) {


    const { color } = useContext(ThemeContext)

    const animatedWidth = new Animated.Value(0)
    const animatedOpacity = new Animated.Value(0)

    const [selected, setSelected] = useState(false)


    const getPictureName = useCallback(() => {
        const splittedPath = props.picturePath.split("/")
        return splittedPath[splittedPath.length - 1]
    }, [props.picturePath])

    const normalPress = useCallback(() => {
        if (props.selectionMode === false) {
            props.click()
        } else if (selected === false) {
            props.select()
            setSelected(true)
        } else if (selected === true) {
            props.deselect()
            setSelected(false)
        }
    }, [props.selectionMode, selected, props.click])

    const longPress = useCallback((nativeEvent) => {
        if (nativeEvent.state === State.ACTIVE) {
            if (props.selectionMode === false) {
                props.select()
                setSelected(true)
            }
        }
    }, [props.selectionMode])


    useEffect(() => {
        if (props.selectionMode === true) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(animatedWidth, {
                        toValue: 30,
                        duration: 50,
                        useNativeDriver: false
                    }),
                    Animated.timing(animatedOpacity, {
                        toValue: 1,
                        duration: 50,
                        useNativeDriver: false
                    })
                ])
            ]).start()
        } else if (props.selectionMode === false) {
            if (selected === false) {
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(animatedWidth, {
                            toValue: 0,
                            duration: 50,
                            useNativeDriver: false
                        }),
                        Animated.timing(animatedOpacity, {
                            toValue: 0,
                            duration: 50,
                            useNativeDriver: false
                        })
                    ])
                ]).start()
            } else {
                setSelected(false)
            }
        }
    }, [props.selectionMode])

    useEffect(() => {
        if (props.selectionMode === false && selected === false) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(animatedWidth, {
                        toValue: 0,
                        duration: 50,
                        useNativeDriver: false
                    }),
                    Animated.timing(animatedOpacity, {
                        toValue: 0,
                        duration: 50,
                        useNativeDriver: false
                    })
                ])
            ]).start()
        }
    }, [selected])


    return (
        <LongPressGestureHandler
            maxDist={30} 
            minDurationMs={800} 
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <PictureButton style={{aspectRatio: 2/3}} onPress={() => normalPress()}>
                <PictureImage 
                    source={{uri: `file://${props.picturePath}`}} 
                    style={{aspectRatio: 2/3, resizeMode: "contain"}}
                />

                <FileNameView>
                    <FileNameText numberOfLines={1}>
                        {getPictureName()}
                    </FileNameText>
                </FileNameView>

                <Animated.View style={[CheckBoxView, {opacity: animatedOpacity, width: animatedWidth}]}>
                    <CheckBox 
                        value={selected}
                        onChange={() => normalPress()}
                        tintColors={{
                            true: color.icon,
                            false: color.icon
                        }}
                    />
                </Animated.View>
            </PictureButton>
        </LongPressGestureHandler>
    )
}