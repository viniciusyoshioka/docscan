import React from "react"
import { TextProps } from "react-native"
import styled from "styled-components/native"

import { styledProps } from "../../../service/theme"


export interface HeaderTitleProps extends TextProps {
    children?: string,
}


export const HeaderTitleBase = styled.Text`
    width: 100%;
    font-size: 19px;
    color: ${(props: styledProps) => props.theme.color.colorLight};
`


export function HeaderTitle(props: HeaderTitleProps) {
    return <HeaderTitleBase {...props} numberOfLines={1} />
}
