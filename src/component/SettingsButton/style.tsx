import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const SettingsButtonBase = styled(RectButton)`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-horizontal: 10px;
    width: 100%;
    height: 60px;
`


export const ButtonTitle = styled.Text`
    font-size: 16px;
    color: ${(props: styledProps) => props.theme.color.color};
`


export const ButtonDescription = styled.Text`
    font-size: 13px;
    color: ${(props: styledProps) => props.theme.color.colorDark};
`
