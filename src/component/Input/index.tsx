import React, { forwardRef, useContext } from "react"
import { TextInput, TextInputProps } from "react-native"

import { InputBase } from "./style"
import { ThemeContext } from "../../service/theme"


export const Input = forwardRef((props: TextInputProps, ref?: React.Ref<TextInput>) => {


    const { color } = useContext(ThemeContext)


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
