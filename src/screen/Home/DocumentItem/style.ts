import { RectButton } from "react-native-gesture-handler"
import styled from "styled-components/native"

import { StyledProps } from "../../../types"


export const DOCUMENT_PICTURE_HEIGHT = 60


export const Button = styled(RectButton)`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: ${DOCUMENT_PICTURE_HEIGHT}px;
    margin-bottom: 8px;
    margin-horizontal: 8px;
    padding: 8px;
    border-radius: 4px;
    background-color: ${(props: StyledProps) => props.theme.color.documentItem_background};
    elevation: 2;
`


export const Block = styled.View`
    align-items: center;
    justify-content: center;
`


export const Title = styled.Text`
    flex: 1;
    width: 100%;
    text-align: left;
    text-align-vertical: top;
    font-size: 16px;
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: StyledProps) => props.theme.color.documentItem_color};
`


export const Date = styled.Text`
    width: 100%;
    text-align: left;
    text-align-vertical: bottom;
    font-size: 12px;
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
    color: ${(props: StyledProps) => props.theme.color.documentItem_color};
`
