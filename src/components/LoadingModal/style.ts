import styled from "styled-components/native"

import { StyledProps } from "../../theme"


export const LoadingModalBackground = styled.View`
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
`


export const LoadingModalView = styled.View<StyledProps>`
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    padding: 16px;
    width: 100%;
    max-width: 250px;
    background-color: ${props => props.theme.color.surface};
    border-radius: 4px;
`


export const LoadingModalText = styled.Text<StyledProps>`
    flex: 1;
    margin-left: 16px;
    font-size: 15px;
    color: ${props => props.theme.color.onSurface};
`
