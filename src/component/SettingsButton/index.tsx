import React from "react"
import { RectButton, RectButtonProps } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


const SettingsButtonBase = styled(RectButton)`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-horizontal: 10px;
    width: 100%;
    height: 60px;
`


const ButtonTitle = styled.Text`
    font-size: 16px;
    color: ${(props: styledProps) => props.theme.color.color};
`


const ButtonDescription = styled.Text`
    font-size: 13px;
    color: ${(props: styledProps) => props.theme.color.colorDark};
`


export interface SettingsButtonProps extends RectButtonProps {
    title?: string,
    description?: string,
}


export function SettingsButton(props: SettingsButtonProps) {
    return (
        <SettingsButtonBase {...props}>
            {props.title && (
                <ButtonTitle>
                    {props.title}
                </ButtonTitle>
            )}

            {props.description && (
                <ButtonDescription>
                    {props.description}
                </ButtonDescription>
            )}
        </SettingsButtonBase>
    )
}
