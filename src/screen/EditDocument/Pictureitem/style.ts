import FastImage from "react-native-fast-image"
import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "@theme"


export const PICTURE_BUTTON_MARGIN = 4


export const PictureButton = styled(RectButton)<StyledProps>`
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: ${PICTURE_BUTTON_MARGIN}px;
    border-radius: ${props => props.theme.shape.small}px;
    aspect-ratio: 1;
`


export const PictureImage = styled(FastImage)<StyledProps>`
    flex: 1;
    border-radius: ${props => props.theme.shape.small}px;
    resize-mode: cover;
    aspect-ratio: 1;
`


export const SelectedSurface = styled.View<StyledProps>`
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: ${props => props.theme.shape.small}px;
    background-color: ${props => props.theme.color.primary};
    opacity: 0.6;
`
