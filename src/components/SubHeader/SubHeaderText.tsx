import React from "react"
import { TextProps } from "react-native"
import styled from "styled-components/native"

import { StyledProps } from "../../types"


const SubHeaderTextBase = styled.Text`
    width: 100%;
    font-size: 13px;
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
    color: ${(props: StyledProps) => props.theme.color.subHeader_color};
`


export interface SubHeaderTextProps extends TextProps {
    children?: string
}


export function SubHeaderText(props: SubHeaderTextProps) {
    return (
        <SubHeaderTextBase
            numberOfLines={1}
            ellipsizeMode={"head"}
            {...props}
        />
    )
}
