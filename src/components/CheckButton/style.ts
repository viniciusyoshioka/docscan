import styled from "styled-components/native"

import { StyledProps } from "../../theme"


export const Button = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
`


export const Text = styled.Text`
    margin-left: 16px;
    font-size: 15px;
    color: ${(props: StyledProps) => props.theme.color.onSurface};
`
