import styled from "styled-components/native"

import { StyledProps } from "../../types"


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
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: StyledProps) => props.theme.color.radioButton_unchecked_color};
`
