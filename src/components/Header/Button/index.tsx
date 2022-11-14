import React from "react"
import { BorderlessButtonProps } from "react-native-gesture-handler"

import { Icon } from "../.."
import { useAppTheme } from "../../../services/theme"
import { IconGroup } from "../../../types"
import { HeaderButtonBase } from "./style"


export interface HeaderButtonProps extends BorderlessButtonProps {
    iconName: string;
    iconGroup?: IconGroup;
    iconSize?: number;
}


export const HeaderButton = (props: HeaderButtonProps) => {


    const { color, opacity } = useAppTheme()


    return (
        <HeaderButtonBase rippleColor={color.header_ripple} {...props}>
            <Icon
                iconName={props.iconName}
                iconGroup={props.iconGroup}
                iconSize={props.iconSize || 24}
                iconColor={color.header_color}
                iconStyle={{ opacity: opacity.headerEmphasis }}
            />
        </HeaderButtonBase>
    )
}
