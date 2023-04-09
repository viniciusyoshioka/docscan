import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


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
    background-color: ${(props: StyledProps) => props.theme.color.onSurface};
    border-color: ${(props: StyledProps & { isFocused: boolean }) => (
        props.isFocused ? props.theme.color.primary : props.theme.color.onSurface
    )};
`
