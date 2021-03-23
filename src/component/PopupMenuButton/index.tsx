import React from "react"

import { PopupMenuButtonBase, PopupMenuButtonText } from "./style"


export interface PopupMenuButtonProps {
    text: string,
    onPress: () => void,
}


export function PopupMenuButton(props: PopupMenuButtonProps) {
    return (
        <PopupMenuButtonBase onPress={props.onPress}>
            <PopupMenuButtonText numberOfLines={1}>
                {props.text}
            </PopupMenuButtonText>
        </PopupMenuButtonBase>
    )
}


export { PopupMenuButtonBase, PopupMenuButtonText }
