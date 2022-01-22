import styled from "styled-components/native"

import { StyledProps } from "../../../types"


export const ShowPasswordButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 2px;
    border-bottom-width: 2px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: ${(props: StyledProps) => props.theme.color.input_background};
    border-color: ${(props: StyledProps & { isFocused: boolean }) => {
        return props.isFocused ? props.theme.color.input_focus_border : props.theme.color.input_background
    }};
`
