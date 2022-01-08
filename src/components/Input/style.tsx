import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const InputBase = styled.TextInput`
    height: 48px;
    padding-vertical: 0px;
    padding-left: 16px;
    padding-right: 12px;
    font-size: 16.5px;
    border-radius: 2px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    border-bottom-width: ${(props: StyledProps & { isFocused?: boolean }) => {
        return props.isFocused ? 2 : 0
    }}px;
    background-color: ${(props: StyledProps) => props.theme.color.input_background};
    color: ${(props: StyledProps) => props.theme.color.input_color};
    border-color: ${(props: StyledProps & { isFocused?: boolean }) => {
        return props.isFocused ? props.theme.color.input_focus_border : props.theme.color.input_unfocus_border
    }};
`
