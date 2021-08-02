import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const ModalTitle = styled.Text`
    text-align-vertical: center;
    margin-horizontal: 24px;
    height: 64px;
    font-size: 20px;
    opacity: ${(props: styledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: styledProps) => props.theme.color.modal_color};
`
