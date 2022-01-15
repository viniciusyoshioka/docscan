import React, { forwardRef, Ref, useState } from "react"
import { TextInput, TextInputProps } from "react-native"

import { useColorTheme } from "../../services/theme"
import { InputBase } from "./style"


export interface InputProps extends TextInputProps {
    isFocused?: boolean,
}


export const Input = forwardRef((props: InputProps, ref?: Ref<TextInput>) => {


    const { color } = useColorTheme()

    const [isFocused, setIsFocused] = useState(false)


    return (
        <InputBase
            blurOnSubmit={false}
            placeholderTextColor={color.input_placeholder}
            ref={ref}
            selectionColor={color.input_selection}
            onBlur={(e) => {
                if (props.isFocused === undefined) {
                    setIsFocused(false)
                }
                if (props.onBlur) {
                    props.onBlur(e)
                }
            }}
            onFocus={(e) => {
                if (props.isFocused === undefined) {
                    setIsFocused(true)
                }
                if (props.onFocus) {
                    props.onFocus(e)
                }
            }}
            isFocused={props.isFocused !== undefined ? props.isFocused : isFocused}
            {...props}
        />
    )
})