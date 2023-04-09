import styled from "styled-components/native"

import { StyledProps } from "../../theme"


export const InputBase = styled.TextInput`
    height: 48px;
    padding-vertical: 0px;
    padding-left: 16px;
    padding-right: 12px;
    font-size: 16.5px;
    border-radius: 2px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    border-bottom-width: ${(props: StyledProps & { isFocused?: boolean }) => props.isFocused ? 2 : 0}px;
    background-color: ${(props: StyledProps) => props.theme.color.surface};
    color: ${(props: StyledProps) => props.theme.color.onSurface};
    border-color: ${(props: StyledProps & { isFocused?: boolean }) => (
        props.isFocused ? props.theme.color.primary : props.theme.color.onSurface
    )};
`
