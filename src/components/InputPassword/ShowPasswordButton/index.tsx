import React from "react"
import { TouchableOpacityProps } from "react-native"

import { Icon } from "../../"
import { useAppTheme } from "../../../services/theme"
import { ShowPasswordButtonBase } from "./style"


export interface ShowPasswordButtonProps extends TouchableOpacityProps {
    showPassword: boolean;
    isFocused: boolean;
}


export const ShowPasswordButton = (props: ShowPasswordButtonProps) => {


    const { color, opacity } = useAppTheme()


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
