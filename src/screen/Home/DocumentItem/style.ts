import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "@theme"


export const DOCUMENT_ITEM_HEIGHT = 60


export const DocumentItemButton = styled(RectButton)<StyledProps>`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: ${DOCUMENT_ITEM_HEIGHT}px;
    padding-horizontal: 16px;
    padding-vertical: 8px;
    background-color: ${props => props.theme.color.surface};
`


export const DocumentItemBlock = styled.View`
    flex: 1;   
    justify-content: center;
`
