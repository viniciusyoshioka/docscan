import { Color } from "@elementium/color"
import { useMemo } from "react"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import { useAppTheme } from "../../../theme"


export const CONTROL_ACTION_SIZE = 56


export interface ControlActionProps extends TouchableOpacityProps {
    isShowingCamera?: boolean;
}


export function ControlAction(props: ControlActionProps) {


    const { color, state } = useAppTheme()


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
        <TouchableOpacity
            activeOpacity={0.7}
            {...props}
            style={[styles.container, props.style, { backgroundColor } ]}
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
