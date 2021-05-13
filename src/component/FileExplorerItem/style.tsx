import styled from "styled-components/native"
import { RectButton } from "react-native-gesture-handler"

import { styledProps } from "../../service/theme"


export const Button = styled(RectButton)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 55px;
`


export const ViewIcon = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 10px;
`


export const ViewPath = styled.View`
    display: flex;
    flex: 1;
    align-items: flex-start;
    justify-content: center;
`


export const ItemNameText = styled.Text`
    font-size: 17px;
    color: ${(props: styledProps) => props.theme.color.colorLight};
`


export const FullPathText = styled.Text`
    font-size: 12px;
    color: ${(props: styledProps) => props.theme.color.colorDark};
`
