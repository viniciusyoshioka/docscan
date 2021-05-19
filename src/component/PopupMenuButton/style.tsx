import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const PopupMenuButtonBase = styled(RectButton)`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-horizontal: 16px;
    height: 48px;
    background-color: ${(props: styledProps) => props.theme.color.popupMenuButton_background};
`


export const PopupMenuButtonText = styled.Text`
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.popupMenuButton_color};
`
