import { Color } from "@elementium/color"
import { Icon } from "@elementium/native"
import { useEffect } from "react"
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native"
import { OrientationType } from "react-native-orientation-locker"
import { Text } from "react-native-paper"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useDeviceOrientation } from "@hooks"
import { useAppTheme } from "@theme"


const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable)


export const ACTION_SIZE = 56


export interface ActionProps extends PressableProps {
    isShowingCamera: boolean
    icon?: string
    counter?: string
    style?: StyleProp<ViewStyle>
}


export function Action(props: ActionProps) {


    const { color, state } = useAppTheme()

    const deviceOrientation = useDeviceOrientation()
    const rotationDegree = useSharedValue(0)


    const colorStyle = props.isShowingCamera ? "white" : color.onBackground
    const contentColor = props.disabled
        ? new Color(colorStyle).setA(state.content.disabled).toRgba()
        : colorStyle
    const rippleColor = new Color(colorStyle).setA(state.container.pressed).toRgba()


    function ActionIcon() {
        if (!props.icon) return null

        return (
            <Icon
                name={props.icon}
                group={"material-community"}
                color={contentColor}
            />
        )
    }

    function CounterText() {
        if (!props.counter) return null

        return (
            <Text
                style={{ color: contentColor }}
                children={props.counter}
            />
        )
    }


    useEffect(() => {
        switch (deviceOrientation) {
            case OrientationType["PORTRAIT"]:
                if (rotationDegree.value === 90) {
                    rotationDegree.value -= 90
                } else if (rotationDegree.value === 270) {
                    rotationDegree.value += 90
                } else {
                    rotationDegree.value = 0
                }
                break
            case OrientationType["PORTRAIT-UPSIDEDOWN"]:
                if (rotationDegree.value === 90) {
                    rotationDegree.value += 90
                } else if (rotationDegree.value === 270) {
                    rotationDegree.value -= 90
                } else {
                    rotationDegree.value = 180
                }
                break
            case OrientationType["LANDSCAPE-LEFT"]:
                if (rotationDegree.value === 0) {
                    rotationDegree.value += 90
                } else if (rotationDegree.value === 180) {
                    rotationDegree.value -= 90
                } else {
                    rotationDegree.value = 90
                }
                break
            case OrientationType["LANDSCAPE-RIGHT"]:
                if (rotationDegree.value === 0) {
                    rotationDegree.value -= 90
                } else if (rotationDegree.value === 180) {
                    rotationDegree.value += 90
                } else {
                    rotationDegree.value = 270
                }
                break
        }
    }, [deviceOrientation])

    const animatedRotation = useDerivedValue(() => withTiming(rotationDegree.value, {
        duration: 200,
    }))

    const orientationStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${animatedRotation.value}deg` },
        ],
    }))


    return (
        <AnimatedPressable
            android_ripple={{ color: rippleColor, radius: ACTION_SIZE / 2 }}
            {...props}
            style={[styles.action, orientationStyle, props.style]}
        >
            <ActionIcon />

            <CounterText />
        </AnimatedPressable>
    )
}


const styles = StyleSheet.create({
    action: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: ACTION_SIZE,
        height: ACTION_SIZE,
    },
})
