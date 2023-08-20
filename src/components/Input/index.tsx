import { forwardRef, Ref, useState } from "react"
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps } from "react-native"

import { useAppTheme } from "@theme"
import { InputBase, InputBaseProps } from "./style"


export interface InputProps extends TextInputProps, InputBaseProps {}


export const Input = forwardRef((props: InputProps, ref?: Ref<TextInput>) => {


    const { color } = useAppTheme()

    const [isFocused, setIsFocused] = useState(false)


    function onBlur(event: NativeSyntheticEvent<TextInputFocusEventData>) {
        if (props.isFocused === undefined) {
            setIsFocused(false)
        }
        if (props.onBlur) {
            props.onBlur(event)
        }
    }

    function onFocus(event: NativeSyntheticEvent<TextInputFocusEventData>) {
        if (props.isFocused === undefined) {
            setIsFocused(true)
        }
        if (props.onFocus) {
            props.onFocus(event)
        }
    }


    return (
        <InputBase
            ref={ref}
            blurOnSubmit={false}
            placeholderTextColor={color.onSurfaceVariant}
            selectionColor={color.primaryContainer}
            cursorColor={color.primaryContainer}
            {...props}
            isFocused={props.isFocused !== undefined ? props.isFocused : isFocused}
            onBlur={onBlur}
            onFocus={onFocus}
        />
    )
})
