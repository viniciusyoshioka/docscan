import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const Button = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
`


export const Text = styled.Text`
    margin-left: 16px;
    font-size: 15px;
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: StyledProps) => props.theme.color.checkButton_unchecked_color};
`
