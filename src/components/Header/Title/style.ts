import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


export const HeaderTitleBase = styled.Text`
    flex: 1;
    font-size: 20px;
    color: ${(props: StyledProps) => props.theme.color.onSurface};
`
