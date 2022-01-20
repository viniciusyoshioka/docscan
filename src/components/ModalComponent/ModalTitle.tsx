import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const ModalTitle = styled.Text`
    text-align-vertical: center;
    margin-horizontal: 24px;
    margin-vertical: 16px;
    font-size: 20px;
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: StyledProps) => props.theme.color.modal_color};
`
