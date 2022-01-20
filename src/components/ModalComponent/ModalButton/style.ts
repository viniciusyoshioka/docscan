import styled from "styled-components/native"

import { StyledProps } from "../../../types"


export const ButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    min-width: 64px;
    min-height: 36px;
    padding-horizontal: 8px;
    margin-left: 8px;
`


export const ButtonTextBase = styled.Text`
    font-size: 16px;
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: StyledProps) => props.theme.color.modal_color};
`
