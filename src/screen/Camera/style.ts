import styled from "styled-components/native"
import { StyledProps } from "../../types"


export const CameraWrapper = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`


export const NoCameraAvailableText = styled.Text`
    font-size: 17px;
    text-align: center;
    color: ${(props: StyledProps) => props.theme.color.screen_color};
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
`
