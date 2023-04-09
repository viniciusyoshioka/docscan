import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


export const HEADER_HEIGHT = 56


export const HeaderBase = styled.View`
    flex-direction: row;
    align-items: center;
    height: ${HEADER_HEIGHT}px;
    padding-left: 8px;
    background-color: ${(props: StyledProps) => props.theme.color.surface};
`
