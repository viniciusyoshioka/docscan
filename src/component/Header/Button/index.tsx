import React from "react"
import { RectButton, RectButtonProps } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { HeaderIcon, HeaderIconProps } from "../Icon"


export interface HeaderButtonProps extends RectButtonProps, HeaderIconProps {}


export const HeaderButtonBase = styled(RectButton)`
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
`


export function HeaderButton(props: HeaderButtonProps) {
    return (
        <HeaderButtonBase {...props}>
            <HeaderIcon iconName={props.iconName} iconSize={props.iconSize} />
        </HeaderButtonBase>
    )
}
