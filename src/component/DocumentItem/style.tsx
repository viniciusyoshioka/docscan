import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const Button = styled(RectButton)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 3px;
    padding: 3px 5px;
    height: 55px;
    border-radius: 1px;
    background-color: ${(props: styledProps) =>  props.theme.color.backgroundDark};
`


export const Block = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
`


export const Line = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
`


export const Title = styled.Text`
    font-size: 16px;
    color: ${(props: styledProps) => props.theme.color.color};
`


export const Date = styled.Text`
    font-size: 12px;
    color: ${(props: styledProps) => props.theme.color.colorDark};
`
