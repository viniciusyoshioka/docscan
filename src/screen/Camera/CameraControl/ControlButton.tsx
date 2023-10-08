import { Color } from "@elementium/color"
import { Icon, Pressable, PressableProps } from "@elementium/native"
import { useMemo } from "react"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { Text } from "react-native-paper"

import { useAppTheme } from "@theme"


export const CONTROL_BUTTON_HEIGHT = 56
export const CONTROL_BUTTON_RADIUS = CONTROL_BUTTON_HEIGHT / 2


export interface ControlButtonProps extends PressableProps {
    icon?: string;
    isShowingCamera?: boolean;
    indexCount?: string;
    style?: StyleProp<ViewStyle>;
}


export function ControlButton(props: ControlButtonProps) {


    const { color, state } = useAppTheme()

    const colorStyle = useMemo(() => {
        if (props.isShowingCamera) return "white"
        return color.onBackground
    }, [props.isShowingCamera, color.onBackground])
    const contentColor = useMemo(() => {
        if (props.disabled) {
            return new Color(colorStyle as string).setA(state.content.disabled).toRgba()
        }
        return colorStyle
    }, [props.disabled, colorStyle, state.content.disabled])
    const rippleColor = new Color(colorStyle as string).setA(state.container.pressed).toRgba()


    return (
        <Pressable
            android_ripple={{ color: rippleColor, radius: CONTROL_BUTTON_RADIUS }}
            {...props}
            style={[style.container, props.style]}
        >
            {props.icon && (
                <Icon
                    name={props.icon}
                    group={"material-community"}
                    color={contentColor}
                />
            )}

            {props.indexCount && (
                <Text
                    style={{ color: contentColor }}
                    children={props.indexCount}
                />
            )}
        </Pressable>
    )
}


const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: CONTROL_BUTTON_HEIGHT,
        height: CONTROL_BUTTON_HEIGHT,
    },
})
