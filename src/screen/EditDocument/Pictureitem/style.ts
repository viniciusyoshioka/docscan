import FastImage from "react-native-fast-image"
import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


export const PICTURE_BUTTON_MARGIN = 4

export const PictureButton = styled(RectButton)`
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: ${PICTURE_BUTTON_MARGIN}px;
    border-radius: 6px;
    background-color: ${(props: StyledProps) => props.theme.color.surface};
    elevation: 2;
    aspect-ratio: 1;
`


export const PictureImage = styled(FastImage)`
    flex: 1;
    border-radius: 6px;
    resize-mode: cover;
    aspect-ratio: 1;
`


export const SelectedSurface = styled.View`
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: 6px;
    opacity: 0.5;
    background-color: ${(props: StyledProps) => props.theme.color.primary};
`
