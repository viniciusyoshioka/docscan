import React from "react"
import { TouchableOpacityProps } from "react-native"
import styled from "styled-components/native"

import { Icon } from ".."
import { useColorTheme } from "../../services/theme"
import { StyledProps } from "../../types"


const ShowPasswordButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 2px;
    border-bottom-width: 2px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: ${(props: StyledProps) => props.theme.color.input_background};
    border-color: ${(props: StyledProps & { isFocused: boolean }) => {
        return props.isFocused ? props.theme.color.input_focus_border : props.theme.color.input_background
    }};
`


export interface ShowPasswordButtonProps extends TouchableOpacityProps {
    showPassword: boolean;
    isFocused: boolean;
}


export function ShowPasswordButton(props: ShowPasswordButtonProps) {


    const { color, opacity } = useColorTheme()


    return (
        <ShowPasswordButtonBase activeOpacity={0.7} {...props}>
            <Icon
                iconName={props.showPassword ? "visibility" : "visibility-off"}
                iconSize={24}
                iconColor={color.input_color}
                iconStyle={{ opacity: opacity.highEmphasis }}
            />
        </ShowPasswordButtonBase>
    )
}
