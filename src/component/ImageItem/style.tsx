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
    align-items: center;
    justify-content: center;
    border-radius: 1px;
    opacity: ${(props: styledProps) => props.theme.opacity.mediumEmphasis};
    background-color: ${(props: styledProps) => props.theme.color.imageItem_selected_background};
`
