import React from "react"
import { TouchableOpacityProps } from "react-native"

import { Icon } from ".."
import { useColorTheme } from "../../services/theme"
import { Button, Text } from "./style"


export interface RadioButtonProps extends TouchableOpacityProps {
    text?: string;
    value?: boolean;
}


export const RadioButton = (props: RadioButtonProps) => {


    const { color, opacity } = useColorTheme()


    return (
        <Button {...props} activeOpacity={0.7}>
            <Icon
                iconName={props.value ? "radio-button-checked" : "radio-button-unchecked"}
                iconColor={props.value ? color.radioButton_checked_color : color.radioButton_unchecked_color}
                iconStyle={{ opacity: opacity.highEmphasis }}
            />

            {props.text && (
                <Text>{props.text}</Text>
            )}
        </Button>
    )
}
