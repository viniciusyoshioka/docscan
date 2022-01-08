import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

import { useColorTheme } from "../../services/theme"
import { Button, Text } from "./style"


export interface RadioButtonProps extends TouchableOpacityProps {
    text?: string,
    value?: boolean,
}


export function RadioButton(props: RadioButtonProps) {


    const { color, opacity } = useColorTheme()


    return (
        <Button {...props} activeOpacity={0.7}>
            <Icon
                name={props.value ? "radio-button-checked" : "radio-button-unchecked"}
                size={24}
                color={props.value ? color.radioButton_checked_color : color.radioButton_unchecked_color}
                style={{
                    opacity: opacity.highEmphasis
                }}
            />

            {props.text && (
                <Text>
                    {props.text}
                </Text>
            )}
        </Button>
    )
}
