import { Icon } from "@elementium/native"
import { useDeviceOrientation } from "@hooks"
import { useEffect } from "react"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"
import { OrientationType } from "react-native-orientation-locker"
import { Text } from "react-native-paper"
import Reanimated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"


const AnimatedTouchableOpacity = Reanimated.createAnimatedComponent(TouchableOpacity)


export const SETTINGS_BUTTON_SIZE = 80


export interface SettingsButtonProps extends TouchableOpacityProps {
    icon: string
    optionName: string
}


export function SettingsButton(props: SettingsButtonProps) {


    const style = StyleSheet.flatten(props.style)


    const deviceOrientation = useDeviceOrientation()
    const rotationDegree = useSharedValue(0)


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
        ...styles.container,
        ...style,
        transform: [
            { rotate: `${animatedRotation.value}deg` },
        ],
    }))


    return (
        <AnimatedTouchableOpacity
            activeOpacity={0.6}
            {...props}
            style={orientationStyle}
        >
            <Icon
                name={props.icon}
                group={"material-community"}
                color={"white"}
                style={{ flex: 1 }}
            />

            <Text
                variant={"labelMedium"}
                numberOfLines={2}
                style={{ flex: 1, color: "white", textAlign: "center" }}
                children={props.optionName}
            />
        </AnimatedTouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: SETTINGS_BUTTON_SIZE,
        height: SETTINGS_BUTTON_SIZE,
        padding: 8,
    },
})
