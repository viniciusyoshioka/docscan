import styled from "styled-components/native"

import { StyledProps } from "../../../types"


export const CompressionText = styled.Text`
    width: 40px;
    text-align: left;
    text-align-vertical: center;
    font-size: 15px;
    color: ${(props: StyledProps & { disabled: boolean }) => props.theme.color.screen_color};
    opacity: ${(props: StyledProps & { disabled: boolean }) => props.disabled
        ? props.theme.opacity.disabled
        : props.theme.opacity.highEmphasis};
`


export const ViewSlider = styled.View`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    height: 56px;
`
