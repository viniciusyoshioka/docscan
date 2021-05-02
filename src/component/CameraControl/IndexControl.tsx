import React from "react"
import { TextProps } from "react-native"
import styled from "styled-components/native"


export const IndexControlBase = styled.Text`
    font-size: 13px;
    color: rgb(255, 255, 255);
`


export interface IndexControlProps extends TextProps {
    children?: string,
}


export function IndexControl(props: IndexControlProps) {
    return <IndexControlBase {...props} numberOfLines={1} />
}
