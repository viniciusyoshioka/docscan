import { StyleSheet } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const Button = styled(RectButton)`
    aspect-ratio: 1;
`


export const ViewCheckBox = StyleSheet.create({
    viewCheckbox: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        left: 0,
    }
}).viewCheckbox


export const CheckboxBackground = styled.View`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 40px;
    height: 40px;
    opacity: 0.7;
    border-bottom-right-radius: 1px;
    background-color: ${(props: styledProps) => props.theme.color.backgroundDark};
`
