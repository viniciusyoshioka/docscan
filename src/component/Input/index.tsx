import React, { forwardRef } from "react"
import { TextInput, TextInputProps } from "react-native"
import styled from "styled-components/native"

import { styledProps, useTheme } from "../../service/theme"


export const InputBase = styled.TextInput`
    font-size: 15px;
    padding: 0px 5px;
    width: 100%;
    color: ${(props: styledProps) => props.theme.color.color};
    border-bottom-width: 2px;
    border-color: ${(props: styledProps) => props.theme.color.color};
`


export const Input = forwardRef((props: TextInputProps, ref?: React.Ref<TextInput>) => {


    const { color } = useTheme()


    return (
        <InputBase
            ref={ref}
            placeholderTextColor={props.placeholderTextColor || color.colorDark}
            blurOnSubmit={false}
            {...props}
        />
    )
})
