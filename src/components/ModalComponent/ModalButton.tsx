import React from "react"
import { TouchableOpacityProps } from "react-native"
import styled from "styled-components/native"

import { StyledProps } from "../../types"


const ModalButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    min-width: 64px;
    min-height: 36px;
    padding-horizontal: 8px;
    margin-left: 8px;
    border-radius: 1px;
`


const ModalButtonTextBase = styled.Text`
    font-size: 16px;
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: StyledProps) => props.theme.color.modal_color};
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
