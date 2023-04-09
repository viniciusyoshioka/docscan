import styled from "styled-components/native"

import { StyledProps } from "../../../theme"


export const CompressionText = styled.Text`
    width: 40px;
    text-align: left;
    text-align-vertical: center;
    font-size: 15px;
    color: ${(props: StyledProps & { disabled: boolean }) => props.theme.color.onBackground};
    opacity: ${(props: StyledProps & { disabled: boolean }) => props.disabled
        ? props.theme.state.content.disabled
        : 1};
`


export const ViewSlider = styled.View`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    height: 56px;
`
