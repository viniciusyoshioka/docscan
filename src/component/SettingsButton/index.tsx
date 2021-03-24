import React from "react"
import { RectButtonProps } from "react-native-gesture-handler"

import { ButtonDescription, ButtonTitle, SettingsButtonBase } from "./style"


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


export { SettingsButtonBase }
