import React from "react"
import { TouchableOpacityProps } from "react-native"

import { ModalButtonBase, ModalButtonTextBase } from "./style"


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


export { ModalButtonBase, ModalButtonTextBase }
