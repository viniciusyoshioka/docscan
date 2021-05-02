import React from "react"
import { TouchableOpacityProps } from "react-native"

import { Button, Check, Radio, Text } from "./style"


export interface RadioButtonProps extends TouchableOpacityProps {
    text?: string,
    value?: boolean,
}


export function RadioButton(props: RadioButtonProps) {
    return (
        <Button {...props}>
            <Radio>
                {props.value && <Check />}
            </Radio>

            <Text numberOfLines={1}>
                {props.text}
            </Text>
        </Button>
    )
}
