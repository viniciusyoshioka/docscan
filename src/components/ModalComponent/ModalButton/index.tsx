import React from "react"
import { TouchableOpacityProps } from "react-native"

import { ButtonBase, ButtonTextBase } from "./style"


export interface ModalButtonProps extends TouchableOpacityProps {
    text?: string;
}


export const ModalButton = (props: ModalButtonProps) => {
    return (
        <ButtonBase {...props}>
            <ButtonTextBase numberOfLines={1}>
                {props.text}
            </ButtonTextBase>
        </ButtonBase>
    )
}
