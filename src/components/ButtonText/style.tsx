import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const ButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    min-width: 64px;
    height: 36px;
`


export const ButtonTextContent = styled.Text`
    font-size: 15px;
    color: ${(props: StyledProps) => props.theme.color.button_background};
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
`
