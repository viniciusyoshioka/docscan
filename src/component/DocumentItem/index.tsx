import React, { useCallback, useContext, useEffect, useState } from "react"
import { Animated, View } from "react-native"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"
import CheckBox from "@react-native-community/checkbox"

import { Document } from "../../service/object-types"
import { ThemeContext } from "../../service/theme"
import { Block, Button, Date, Line, Title } from "./style"


export interface DocumentItemProps {
    click: () => void,
    select: () => void,
    deselect: () => void,
    selectionMode: boolean,
    document: Document,
}


export function DocumentItem(props: DocumentItemProps) {


    const { color } = useContext(ThemeContext)

    const animatedWidth = new Animated.Value(0)
    const animatedOpacity = new Animated.Value(0)

    const [selected, setSelected] = useState(false)


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
            Animated.parallel([
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
        } else if (props.selectionMode === false) {
            if (selected === false) {
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
                ]).start()
            } else {
                setSelected(false)
            }
        }
    }, [props.selectionMode])

    useEffect(() => {
        if (props.selectionMode === false && selected === false) {
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
            ]).start()
        }
    }, [selected])


    return (
        <LongPressGestureHandler 
            maxDist={30} 
            minDurationMs={800} 
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <Button onPress={() => normalPress()}>
                <Animated.View 
                    style={[Block, {
                        width: animatedWidth, opacity: animatedOpacity, 
                        marginRight: 5
                    }]}
                >
                    <CheckBox 
                        value={selected}
                        onChange={() => normalPress()}
                        tintColors={{
                            true: color.icon,
                            false: color.icon
                        }}
                    />
                </Animated.View>

                <View style={[Block, {alignItems: "flex-start"}]}>
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
