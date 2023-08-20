import { Text } from "@elementium/native"
import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "@theme"


export const MenuItemBase = styled(RectButton)`
    align-items: flex-start;
    justify-content: center;
    padding-horizontal: 12px;
    min-width: 112px;
    max-width: 280px;
    height: 48px;
    background-color: ${(props: StyledProps) => props.theme.color.surfaceContainer};
    elevation: ${(props: StyledProps) => props.theme.elevation.level2};
`


export const MenuItemText = styled(Text)`
    width: 100%;
    color: ${(props: StyledProps) => props.theme.color.onSurfaceVariant};
`
