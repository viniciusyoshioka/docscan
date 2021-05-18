import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const Button = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`


export const Radio = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 10px 5px 5px;
    border-width: 2px;
    width: 24px;
    height: 24px;
    border-radius: 24px;
    border-color: ${(props: styledProps) => props.theme.color.radioButton_color};
`


export const Check = styled.View`
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background-color: ${(props: styledProps) => props.theme.color.radioButton_color};
`


export const Text = styled.Text`
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.radioButton_color};
`
