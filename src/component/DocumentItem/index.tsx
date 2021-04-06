import React, { useCallback, useEffect, useState } from "react"
import { Animated, View } from "react-native"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"
import CheckBox from "@react-native-community/checkbox"

import { Document } from "../../service/object-types"
import { useTheme } from "../../service/theme"
import { Block, Button, Date, Line, Title } from "./style"


export interface DocumentItemProps {
    click: () => void,
    select: () => void,
    deselect: () => void,
    selectionMode: boolean,
    document: Document,
}


export function DocumentItem(props: DocumentItemProps) {


    const { color } = useTheme()

    const [selected, setSelected] = useState(false)
    const animatedWidth = new Animated.Value(0)
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
                Animated.timing(animatedWidth, {
                    toValue: 35,
                    duration: 50,
                    useNativeDriver: false
                }),
                Animated.timing(animatedOpacity, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: false
                })
            ]).start()
        } else if (!props.selectionMode) {
            if (!selected) {
                Animated.sequence([
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
                ]).start()
            } else {
                setSelected(false)
            }
        }
    }, [props.selectionMode])

    useEffect(() => {
        if (!props.selectionMode && !selected) {
            Animated.sequence([
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
            ]).start()
        }
    }, [selected])


    return (
        <LongPressGestureHandler 
            maxDist={30} 
            minDurationMs={800} 
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <Button onPress={normalPress}>
                <Animated.View 
                    style={[Block, {
                        width: animatedWidth, opacity: animatedOpacity, 
                        marginRight: props.selectionMode ? 5 : 0,
                    }]}
                >
                    <CheckBox 
                        value={selected}
                        onChange={normalPress}
                        tintColors={{
                            true: color.color,
                            false: color.color
                        }}
                    />
                </Animated.View>

                <View style={[Block, {alignItems: "flex-start", flex: 1}]}>
                    <Line>
                        <Title numberOfLines={1}>
                            {props.document.name}
                        </Title>
                    </Line>

                    <Line>
                        <Date numberOfLines={1}>
                            {props.document.lastModificationDate}
                        </Date>
                    </Line>
                </View>
            </Button>
        </LongPressGestureHandler>
    )
}
