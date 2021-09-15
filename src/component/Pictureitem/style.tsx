import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const PictureButton = styled(RectButton)`
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: 4px;
    border-radius: 1px;
    background-color: ${(props: styledProps) => props.theme.color.pictureItem_background};
    elevation: 2;
    aspect-ratio: 1;
`


export const PictureImage = styled.Image`
    flex: 1;
    border-radius: 1px;
    resize-mode: cover;
    aspect-ratio: 1;
`


export const FileNameView = styled.View`
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 32px;
    padding-horizontal: 6px;
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    opacity: ${(props: styledProps) => props.theme.opacity.highEmphasis};
    background-color: ${(props: styledProps) => props.theme.color.pictureItem_background};
`


export const FileNameText = styled.Text`
    width: 100%;
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.pictureItem_color};
`


export const SelectedSurface = styled.View`
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    align-items: center;
    justify-content: center;
    border-radius: 1px;
    opacity: ${(props: styledProps) => props.theme.opacity.mediumEmphasis};
    background-color: ${(props: styledProps) => props.theme.color.pictureItem_selected_background};
`
