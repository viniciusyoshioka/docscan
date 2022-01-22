import React from "react"
import styled from "styled-components/native"
import { RectButton } from "react-native-gesture-handler"

import { useColorTheme } from "../../services/theme"
import { StyledProps } from "../../types"
import { Icon } from ".."


export const ButtonBase = styled(RectButton)`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    min-width: 64px;
    height: 36px;
    border-radius: 2px;
    background-color: ${(props: StyledProps) => props.theme.color.button_background};
`


export interface ButtonIconProps {
    icon: string;
}


export function ButtonIcon(props: ButtonIconProps) {


    const { color, opacity } = useColorTheme()


    return (
        <Icon
            iconName={props.icon}
            iconSize={18}
            iconColor={color.button_color}
            iconStyle={{
                marginRight: 8,
                opacity: opacity.highEmphasis,
            }}
        />
    )
}


export const ButtonTextContent = styled.Text`
    font-size: 15px;
    color: ${(props: StyledProps) => props.theme.color.button_color};
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
`
