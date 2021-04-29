import { Dimensions } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const PictureButton = styled(RectButton)`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: 5px;
    border-radius: 1px;
    max-width: ${(Dimensions.get("window").width / 2) - 10}px;
    background-color: ${(props: styledProps) => props.theme.color.backgroundDark};
`


export const PictureImage = styled.Image`
    display: flex;
    flex: 1;
    margin: 2px;
    resize-mode: contain;
`


export const FileNameView = styled.View`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 30px;
    padding: 0px 3px;
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    background-color: ${(props: styledProps) => props.theme.color.backgroundDark};
`


export const FileNameText = styled.Text`
    width: 100%;
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.colorLight};
`


export const CheckBoxView = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0px;
    top: 0px;
`


export const CheckboxBackground = styled.View`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 30px;
    height: 30px;
    opacity: 0.7;
    border-bottom-right-radius: 1px;
    background-color: ${(props: styledProps) => props.theme.color.backgroundDark};
`
