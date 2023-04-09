import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


export const Button = styled(RectButton)`
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    background-color: ${(props: StyledProps) => props.theme.color.surface};
`


export const SelectionSurface = styled.View`
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    opacity: 0.5;
    background-color: ${(props: StyledProps) => props.theme.color.primary};
`
