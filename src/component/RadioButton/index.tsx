import React from "react"

import { Button, Check, Radio, Text } from "./style"


export interface RadioButtonProps {
    text?: string,
    value?: boolean,
    onPress?: () => void,
}


export function RadioButton(props: RadioButtonProps) {
    return (
        <Button onPress={props.onPress}>
            <Radio>
                {props.value && <Check />}
            </Radio>

            <Text numberOfLines={1}>
                {props.text}
            </Text>
        </Button>
    )
}
