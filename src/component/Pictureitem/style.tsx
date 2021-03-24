import { Dimensions, StyleSheet } from "react-native"
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
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.colorLight};
`


export const CheckBoxView = StyleSheet.create({
    checkbox: {
        alignItems: "center", 
        justifyContent: "center",
        position: "absolute", 
        left: 5, 
        top: 5
    }
}).checkbox
