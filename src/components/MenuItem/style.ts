import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "../../theme"


export const MenuItemBase = styled(RectButton)`
    align-items: flex-start;
    justify-content: center;
    padding-horizontal: 16px;
    height: 48px;
    background-color: ${(props: StyledProps) => props.theme.color.surfaceVariant};
`


export const MenuItemText = styled.Text`
    width: 100%;
    font-size: 15px;
    color: ${(props: StyledProps) => props.theme.color.onSurfaceVariant};
`
