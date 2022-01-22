import React from "react"
import { TextProps } from "react-native"

import { HeaderTitleBase } from "./style"


export interface HeaderTitleProps extends TextProps {
    title?: string;
}


export const HeaderTitle = (props: HeaderTitleProps) => {
    return (
        <HeaderTitleBase {...props} numberOfLines={1}>
            {props.title}
        </HeaderTitleBase>
    )
}
