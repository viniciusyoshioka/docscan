import React from "react"
import { TextProps } from "react-native"
import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const SubHeaderView = styled.View`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    padding: 3px 10px;
    background-color: ${(props: styledProps) => props.theme.color.subHeader_background};
    elevation: 3;
`


export interface SubHeaderTextProps extends TextProps {
    children?: string
}


export const SubHeaderTextBase = styled.Text`
    font-size: 13px;
    color: ${(props: styledProps) => props.theme.color.subHeader_color};
`


export function SubHeaderText(props: SubHeaderTextProps) {
    return (
        <SubHeaderTextBase
            numberOfLines={1}
            ellipsizeMode={"head"}
            {...props}
        />
    )
}
