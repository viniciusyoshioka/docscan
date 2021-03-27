import React from "react"
import { TextProps } from "react-native"

import { IndexControlBase } from "./style"


export interface IndexControlProps extends TextProps {
    children?: string,
}


export function IndexControl(props: IndexControlProps) {
    return <IndexControlBase {...props} numberOfLines={1} />
}


export { IndexControlBase }
