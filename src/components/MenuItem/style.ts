import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const MenuItemBase = styled(RectButton)`
    align-items: flex-start;
    justify-content: center;
    padding-horizontal: 16px;
    height: 48px;
    background-color: ${(props: StyledProps) => props.theme.color.menuItem_background};
`


export const MenuItemText = styled.Text`
    width: 100%;
    font-size: 15px;
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: StyledProps) => props.theme.color.menuItem_color};
`
