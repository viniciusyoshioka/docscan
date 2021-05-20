import React, { forwardRef } from "react"
import { TextInput, TextInputProps } from "react-native"
import styled from "styled-components/native"

import { styledProps, useTheme } from "../../service/theme"


export const InputBase = styled.TextInput`
    width: 100%;
    height: 48px;
    padding-vertical: 0px;
    padding-left: 16px;
    padding-right: 12px;
    font-size: 15px;
    background-color: ${(props: styledProps) => props.theme.color.input_background};
    color: ${(props: styledProps) => props.theme.color.input_color};
    border-color: ${(props: styledProps) => props.theme.color.input_border};
    border-bottom-width: 2px;
`


export const Input = forwardRef((props: TextInputProps, ref?: React.Ref<TextInput>) => {


    const { color } = useTheme()


    return (
        <InputBase
            ref={ref}
            placeholderTextColor={props.placeholderTextColor || color.input_placeholder}
            blurOnSubmit={false}
            {...props}
        />
    )
})
