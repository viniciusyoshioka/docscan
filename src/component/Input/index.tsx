import React, { forwardRef } from "react"
import { TextInput, TextInputProps } from "react-native"

import { InputBase } from "./style"
import { useTheme } from "../../service/theme"


export const Input = forwardRef((props: TextInputProps, ref?: React.Ref<TextInput>) => {


    const { color } = useTheme()


    return (
        <InputBase
            ref={ref || null}
            placeholderTextColor={props.placeholderTextColor || color.colorDark}
            blurOnSubmit={false}
            {...props}
        />
    )
})


export { InputBase }
