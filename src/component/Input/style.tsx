import styled from "styled-components/native"

import { styledProps } from "../../service/theme"


export const InputBase = styled.TextInput`
    font-size: 15px;
    padding: 0px 5px;
    width: 100%;
    color: ${(props: styledProps) => props.theme.color.color};
    border-bottom-width: 2px;
    border-color: ${(props: styledProps) => props.theme.color.color};
`
