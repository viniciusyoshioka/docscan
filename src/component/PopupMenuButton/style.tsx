import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const PopupMenuButtonBase = styled(RectButton)`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-left: 10px;
    padding-vertical: 5px;
    height: 45px;
    background-color: ${(props: styledProps) => props.theme.color.popupMenuButton_background};
`


export const PopupMenuButtonText = styled.Text`
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.popupMenuButton_color};
`
