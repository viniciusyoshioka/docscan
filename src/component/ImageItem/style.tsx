import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const Button = styled(RectButton)`
    aspect-ratio: 1;
    background-color: ${(props: styledProps) => props.theme.color.imageItem_background};
`


export const SelectionSurface = styled.View`
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    border-radius: 1px;
    background-color: ${(props: styledProps) => props.theme.color.imageItem_background};
`
