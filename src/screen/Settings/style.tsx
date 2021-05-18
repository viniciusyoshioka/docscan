import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const ViewVersion = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    margin: 5px;
`


export const TextVersion = styled.Text`
    font-size: 15px;
    color: ${(props: styledProps) => props.theme.color.screen_colorFirst};
`
