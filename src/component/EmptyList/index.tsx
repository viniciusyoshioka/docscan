import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const EmptyListView = styled.View`
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    flex: 1;    
    align-items: center;
    justify-content: center;
`


export const EmptyListImage = styled.Image`
    width: 100px;
    height: 100px;
    tint-color: ${(props: styledProps) => props.theme.color.icon};
`


export const EmptyListText = styled.Text`
    font-size: 16px;
    color: ${(props: styledProps) => props.theme.color.icon};
`
