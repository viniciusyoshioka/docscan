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
    background-color: ${(props: StyledProps) => props.theme.color.surface};
`


export const DocumentItemBlock = styled.View`
    flex: 1;   
    justify-content: center;
`
