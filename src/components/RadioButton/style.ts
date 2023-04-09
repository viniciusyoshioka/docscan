import styled from "styled-components/native"

import { StyledProps } from "../../theme"


export const Button = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 48px;
`


export const Text = styled.Text`
    margin-left: 24px;
    font-size: 15px;
    color: ${(props: StyledProps) => props.theme.color.onSurface};
`
