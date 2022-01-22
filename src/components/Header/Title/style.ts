import styled from "styled-components/native"

import { StyledProps } from "../../../types"


export const HeaderTitleBase = styled.Text`
    flex: 1;
    font-size: 20px;
    margin-right: 4px;
    opacity: ${(props: StyledProps) => props.theme.opacity.headerEmphasis};
    color: ${(props: StyledProps) => props.theme.color.header_color};
`
