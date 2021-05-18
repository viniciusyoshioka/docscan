import React from "react"
import { TouchableOpacityProps } from "react-native"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const ModalButtonBase = styled.TouchableOpacity`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1px;
    min-width: 50px;
    max-height: 30px;
    margin: 0px 3px;
    padding: 3px 5px;
    background-color: ${(props: styledProps) => props.theme.color.modalButton_background};
`


export const ModalButtonTextBase = styled.Text`
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.modalButton_color};
`


export interface ModalButtonProps extends TouchableOpacityProps {
    text?: string,
}


export function ModalButton(props: ModalButtonProps) {
    return (
        <ModalButtonBase {...props}>
            <ModalButtonTextBase numberOfLines={1}>
                {props?.text}
            </ModalButtonTextBase>
        </ModalButtonBase>
    )
}
