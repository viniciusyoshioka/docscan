import styled from "styled-components/native"

import { StyledProps } from "../../../types"


export const ViewCompressionText = styled.View`
    align-items: flex-start;
    justify-content: center;
    width: 40px;
`


export const CompressionText = styled.Text`
    font-size: 15px;
    color: ${(props: StyledProps) => props.theme.color.screen_color};
    opacity: ${(props: StyledProps) => props.theme.opacity.highEmphasis};
`


export const ViewSlider = styled.View`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    height: 56px;
`
