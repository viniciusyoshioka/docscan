import styled from "styled-components/native"

import { StyledProps } from "@theme"


export interface InputBaseProps {
    isFocused?: boolean
}


export const InputBase = styled.TextInput<StyledProps & InputBaseProps>`
    height: 48px;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 16px;
    padding-right: 12px;
    font-size: ${props => props.theme.typography.body.large.fontSize}px;    
    border-top-left-radius: ${props => props.theme.shape.extraSmall}px;
    border-top-right-radius: ${props => props.theme.shape.extraSmall}px;
    border-bottom-width: ${props => props.isFocused ? 2 : 0}px;
    background-color: ${props => props.theme.color.surface};
    color: ${props => props.theme.color.onSurface};
    border-color: ${props => props.isFocused
        ? props.theme.color.primary
        : props.theme.color.onSurfaceVariant};
`
