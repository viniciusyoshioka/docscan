import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const EmptyListView = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`


export const EmptyListImage = styled.Image`
    width: 100px;
    height: 100px;
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
    tint-color: ${(props: StyledProps) => props.theme.color.screen_color};
`


export const EmptyListText = styled.Text`
    font-size: 17px;
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
    color: ${(props: StyledProps) => props.theme.color.screen_color};
`
