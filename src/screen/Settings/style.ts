import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const ViewVersion = styled.View`
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    margin: 8px;
`


export const TextVersion = styled.Text`
    font-size: 15px;
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
    color: ${(props: StyledProps) => props.theme.color.screen_color};
`
