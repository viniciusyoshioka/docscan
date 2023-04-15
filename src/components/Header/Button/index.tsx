import { Color } from "@elementium/color"
import { ExtendableIconProps, Icon } from "@elementium/native"
import { useMemo } from "react"
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native"

import { useAppTheme } from "../../../theme"


export const HEADER_BUTTON_SIZE = 48
export const HEADER_BUTTON_RADIUS = HEADER_BUTTON_SIZE / 2


type PropsToOmitFromPressable = "style"
type PropsToOmitFromIcon = "children" | "style" | "disabled" | "onPress" | "onPressIn" | "onPressOut" | "onLongPress"


export interface HeaderButtonProps extends
    Omit<PressableProps, PropsToOmitFromPressable>,
    Omit<ExtendableIconProps, PropsToOmitFromIcon>
{
    style?: StyleProp<ViewStyle>;
}


export function HeaderButton(props: HeaderButtonProps) {


    const { color, state } = useAppTheme()


    const colorStyle = props.iconColor ?? color.onSurface

    const contentColor = useMemo(() => {
        if (props.disabled) {
            return new Color(colorStyle as string).setA(state.content.disabled).toRgba()
        }

        return colorStyle
    }, [props.disabled, colorStyle, state.content.disabled])
    const rippleColor = new Color(colorStyle as string).setA(state.container.pressed).toRgba()


    return (
        <Pressable
            android_ripple={{ color: rippleColor, radius: HEADER_BUTTON_RADIUS }}
            {...props}
            style={[styles.container, props.style]}
        >
            <Icon
                name={props.iconName}
                group={props.iconGroup}
                size={props.iconSize ?? 24}
                color={contentColor}
            />
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: HEADER_BUTTON_SIZE,
        height: HEADER_BUTTON_SIZE,
    },
})
