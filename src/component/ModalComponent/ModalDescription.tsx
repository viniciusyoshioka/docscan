import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const ModalDescription = styled.Text`
    text-align-vertical: center;
    margin-horizontal: 24px;
    margin-bottom: 24px;
    font-size: 17px;
    opacity: ${(props: styledProps) => props.theme.opacity.mediumEmphasis};
    color: ${(props: styledProps) => props.theme.color.modal_color};
`
