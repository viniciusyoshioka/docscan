import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


export const DocumentItemButton = styled(RectButton)`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 60px;
    padding-horizontal: 16px;
    padding-vertical: 8px;
    border-radius: 4px;
    background-color: ${(props: StyledProps) => props.theme.color.surface};
`


export const DocumentItemBlock = styled.View`
    align-items: center;
    justify-content: center;
`


export const DocumentItemTitle = styled.Text`
    flex: 1;
    width: 100%;
    text-align: left;
    text-align-vertical: top;
    font-size: 16px;
    color: ${(props: StyledProps) => props.theme.color.onSurface};
`


export const DocumentItemDate = styled.Text`
    width: 100%;
    text-align: left;
    text-align-vertical: bottom;
    font-size: 12px;
    color: ${(props: StyledProps) => props.theme.color.onSurface};
`
