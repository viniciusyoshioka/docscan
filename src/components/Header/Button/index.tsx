import { Color } from "@elementium/color"
import { ExtendableIconProps, Icon } from "@elementium/native"
import { BorderlessButtonProps } from "react-native-gesture-handler"

import { useAppTheme } from "../../../theme"
import { HeaderButtonBase, HEADER_BUTTON_RADIUS } from "./style"


export { HEADER_BUTTON_RADIUS, HEADER_BUTTON_SIZE } from "./style"


type PropsToOmit = "style" | "onPress" | "onLongPress"


export interface HeaderButtonProps extends BorderlessButtonProps, Omit<ExtendableIconProps, PropsToOmit> {}


export function HeaderButton(props: HeaderButtonProps) {


    const { color, state } = useAppTheme()


    const contentColor = props.iconColor ?? color.onSurface
    const rippleColor = props.rippleColor ?? new Color(contentColor as string).setA(state.container.pressed).toRgba()


    return (
        <HeaderButtonBase
            rippleColor={rippleColor}
            rippleRadius={HEADER_BUTTON_RADIUS}
            {...props}
        >
            <Icon
                name={props.iconName}
                group={props.iconGroup}
                size={props.iconSize ?? 24}
                color={props.iconColor ?? contentColor}
            />
        </HeaderButtonBase>
    )
}
