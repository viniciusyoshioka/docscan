import { Text } from "@elementium/native"
import styled from "styled-components/native"

import { StyledProps } from "@theme"


export const CompressionText = styled(Text)<StyledProps>`
    width: 40px;
    text-align: left;
    text-align-vertical: center;
    color: ${props => props.theme.color.onSurface};
    opacity: ${props => props.disabled ? props.theme.state.content.disabled : 1};
`


export const ViewSlider = styled.View`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    height: 56px;
`
