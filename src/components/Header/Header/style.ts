import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


export const HEADER_HEIGHT = 56


export const HeaderBase = styled.View<StyledProps>`
    flex-direction: row;
    align-items: center;
    height: ${HEADER_HEIGHT}px;
    background-color: ${props => props.theme.color.surface};
`
