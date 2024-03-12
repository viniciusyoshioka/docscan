import Color from "color"
import { useMaterialTheme } from "react-material-design-provider"
import { GestureResponderEvent, StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"


const AnimatedTouchableOpacity = Reanimated.createAnimatedComponent(TouchableOpacity)


export const MAIN_ACTION_SIZE = 64


export interface MainActionProps extends TouchableOpacityProps {
    isShowingCamera: boolean
}


export function MainAction(props: MainActionProps) {


    const { colors, state } = useMaterialTheme()

    const newScale = useSharedValue(1)


    function onPressIn(e: GestureResponderEvent) {
        newScale.value = withTiming(0.9, { duration: 150 })
        if (props.onPressIn) props.onPressIn(e)
    }

    function onPressOut(e: GestureResponderEvent) {
        newScale.value = withTiming(1, { duration: 150 })
        if (props.onPressOut) props.onPressOut(e)
    }

    function onPress(e: GestureResponderEvent) {
        newScale.value = withTiming(0.9, { duration: 50 }, () => {
            newScale.value = withTiming(1, { duration: 50 })
        })
        if (props.onPress) props.onPress(e)
    }


    const style = StyleSheet.flatten(props.style)
    const backgroundColorStyle = (style && style.backgroundColor)
        ? style.backgroundColor as string
        : props.isShowingCamera
            ? "white"
            : colors.onBackground
    const backgroundColor = props.disabled
        ? Color(backgroundColorStyle).alpha(state.disabled).rgb().toString()
        : backgroundColorStyle


    const animatedScale = useAnimatedStyle(() => ({
        ...styles.mainAction,
        ...style,
        backgroundColor,
        transform: [
            { scale: newScale.value },
        ],
    }), [style, backgroundColor, newScale.value])


    return (
        <AnimatedTouchableOpacity
            activeOpacity={1}
            {...props}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}
            style={animatedScale}
        />
    )
}


const styles = StyleSheet.create({
    mainAction: {
        width: MAIN_ACTION_SIZE,
        height: MAIN_ACTION_SIZE,
        borderRadius: MAIN_ACTION_SIZE,
    },
})
