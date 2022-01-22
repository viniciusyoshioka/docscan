import React from "react"
import { BorderlessButton, BorderlessButtonProps } from "react-native-gesture-handler"
import styled from "styled-components/native"
import { Icon } from ".."

import { useColorTheme } from "../../services/theme"


export const HeaderButtonBase = styled(BorderlessButton)`
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: 2px;
`


export interface HeaderButtonProps extends BorderlessButtonProps {
    icon: string;
    iconSize?: number;
}


export function HeaderButton(props: HeaderButtonProps) {


    const { color, opacity } = useColorTheme()


    return (
        <HeaderButtonBase rippleColor={color.header_ripple} {...props}>
            <Icon
                iconName={props.icon}
                iconSize={props.iconSize || 24}
                iconColor={color.header_color}
                iconStyle={{ opacity: opacity.headerEmphasis }}
            />
        </HeaderButtonBase>
    )
}
