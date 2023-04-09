import styled from "styled-components/native"

import { StyledProps } from "../../theme"


export const EmptyListView = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`


export const EmptyListImage = styled.Image`
    width: 100px;
    height: 100px;
    tint-color: ${(props: StyledProps) => props.theme.color.onBackground};
`


export const EmptyListText = styled.Text`
    font-size: 17px;
    color: ${(props: StyledProps) => props.theme.color.onBackground};
`
