import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const ModalDescription = styled.Text`
    text-align-vertical: center;
    margin-horizontal: 24px;
    margin-bottom: 16px;
    font-size: 17px;
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
    color: ${(props: StyledProps) => props.theme.color.modal_color};
`
