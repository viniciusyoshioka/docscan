import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


export const Button = styled(RectButton)`
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
`


export const SelectionSurface = styled.View<StyledProps>`
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: ${props => props.theme.color.primary};
    opacity: 0.6;
`
