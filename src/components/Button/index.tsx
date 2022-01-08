import React from "react"
import { RectButtonProps } from "react-native-gesture-handler"

import { useColorTheme } from "../../services/theme"
import { ButtonBase, ButtonIcon, ButtonTextContent } from "./style"


export interface ButtonProps extends RectButtonProps {
    text?: string,
    icon?: string,
}


export function Button(props: ButtonProps) {


    const { color } = useColorTheme()


    return (
        <ButtonBase
            rippleColor={color.button_ripple}
            style={{
                paddingRight: 16,
                paddingLeft: (props.icon === undefined) ? 16 : 12,
            }}
            {...props}
        >
            {props.icon && (
                <ButtonIcon
                    icon={props.icon}
                />
            )}

            {props.text && (
                <ButtonTextContent>
                    {props.text}
                </ButtonTextContent>
            )}
        </ButtonBase>
    )
}
