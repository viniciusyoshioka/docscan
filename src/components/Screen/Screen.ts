import { ViewProps } from "react-native"
import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const Screen = styled.View<ViewProps & StyledProps>`
    flex: 1;
    background-color: ${props => props.theme.color.screen_background};
`
