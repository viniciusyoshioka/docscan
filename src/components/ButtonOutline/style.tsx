import React from "react"
import styled from "styled-components/native"

import { Icon } from ".."
import { useColorTheme } from "../../services/theme"
import { StyledProps } from "../../types"


export const ButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    min-width: 64px;
    height: 36px;
    border-radius: 4px;
    border-width: 2px;
    border-color: ${(props: StyledProps) => props.theme.color.button_background};
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
            iconColor={color.button_background}
            iconStyle={{
                marginRight: 8,
                opacity: opacity.highEmphasis,
            }}
        />
    )
}


export const ButtonTextContent = styled.Text`
    font-size: 15px;
    color: ${(props: StyledProps) => props.theme.color.button_background};
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
`
