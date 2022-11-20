import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "../../../types"


export const PictureButton = styled(RectButton)`
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: 4px;
    border-radius: 6px;
    background-color: ${(props: StyledProps) => props.theme.color.pictureItem_background};
    elevation: 2;
    aspect-ratio: 1;
`


export const PictureImage = styled.Image`
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
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
    background-color: ${(props: StyledProps) => props.theme.color.pictureItem_selected_background};
`
