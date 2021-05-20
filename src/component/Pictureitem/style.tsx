import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const PictureButton = styled(RectButton)`
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    margin-right: 6px;
    border-radius: 1px;
    background-color: ${(props: styledProps) => props.theme.color.pictureItem_background};
    elevation: 2;
`


export const PictureImage = styled.Image`
    flex: 1;
    border-radius: 1px;
    resize-mode: cover;
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
    background-color: ${(props: styledProps) => props.theme.color.pictureItem_background};
    opacity: 0.8;
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
    opacity: 0.7;
    border-radius: 1px;
    background-color: ${(props: styledProps) => props.theme.color.pictureItem_background};
`
