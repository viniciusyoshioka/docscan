import { Color } from "@elementium/color"
import { useMemo } from "react"
import { GestureResponderEvent, StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { useAppTheme } from "../../../theme"


const ReanimatedTouchableOpacity = Reanimated.createAnimatedComponent(TouchableOpacity)


export const CONTROL_ACTION_SIZE = 64


export interface ControlActionProps extends TouchableOpacityProps {
    isShowingCamera?: boolean;
}


export function ControlAction(props: ControlActionProps) {


    const { color, state } = useAppTheme()

    const isPressed = useSharedValue(false)


    function onPressIn(e: GestureResponderEvent) {
        isPressed.value = true
        if (props.onPressIn) props.onPressIn(e)
    }

    function onPressOut(e: GestureResponderEvent) {
        isPressed.value = false
        if (props.onPressOut) props.onPressOut(e)
    }


    const animatedScale = useAnimatedStyle(() => ({
        transform: [
            { scale: withTiming(isPressed.value ? 0.9 : 1, { duration: 100 }) }
        ]
    }), [isPressed])


    const style = StyleSheet.flatten(props.style)
    const backgroundColorStyle = useMemo(() => {
        if (props.isShowingCamera) return "white"
        if (style && style.backgroundColor) return style.backgroundColor
        return color.onBackground
    }, [props.isShowingCamera, style, color.onBackground])
    const backgroundColor = useMemo(() => {
        if (props.disabled) {
            return new Color(backgroundColorStyle as string).setA(state.content.disabled).toRgba()
        }
        return backgroundColorStyle
    }, [props.disabled, backgroundColorStyle, state.container.disabled])


    return (
        <ReanimatedTouchableOpacity
            activeOpacity={1}
            {...props}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.container, props.style, { backgroundColor }, animatedScale]}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        width: CONTROL_ACTION_SIZE,
        height: CONTROL_ACTION_SIZE,
        borderRadius: CONTROL_ACTION_SIZE,
    },
})
