import { forwardRef, Ref, useState } from "react"
import { TextInput, TextInputProps } from "react-native"

import { useAppTheme } from "../../theme"
import { InputBase } from "./style"


export interface InputProps extends TextInputProps {
    isFocused?: boolean;
}


export const Input = forwardRef((props: InputProps, ref?: Ref<TextInput>) => {


    const { color } = useAppTheme()

    const [isFocused, setIsFocused] = useState(false)


    return (
        <InputBase
            blurOnSubmit={false}
            placeholderTextColor={color.onSurfaceVariant}
            ref={ref}
            selectionColor={color.primary}
            onBlur={e => {
                if (props.isFocused === undefined) {
                    setIsFocused(false)
                }
                if (props.onBlur) {
                    props.onBlur(e)
                }
            }}
            onFocus={e => {
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
