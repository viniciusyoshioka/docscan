import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const Button = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
`


export const Text = styled.Text`
    margin-top: 10px;
    font-size: 15px;
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
    color: ${(props: StyledProps) => props.theme.color.screen_color};
`