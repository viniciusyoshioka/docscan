import { Text, View } from "react-native"
import styled from "styled-components/native"

import { StyledProps } from "../../types"


export const CameraTextWrapper = styled(View)`
    flex: 1;
    align-items: flex-start;
    justify-content: center;
    padding: 16px;
`


export const CameraButtonWrapper = styled(View)`
    align-items: center;
    justify-content: center;
    padding: 16px;
`


export const CameraWrapper = styled(View)`
    flex: 1;
    align-items: center;
    justify-content: center;
`


export const NoCameraAvailableTitle = styled(Text)`
    width: 100%;
    margin-bottom: 16px;
    font-size: 19px;
    font-weight: bold;
    text-align: center;
    color: ${(props: StyledProps) => props.theme.color.screen_color};
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
`


export const NoCameraAvailableText = styled(Text)`
    margin-bottom: 2px;
    font-size: 17px;
    color: ${(props: StyledProps) => props.theme.color.screen_color};
    opacity: ${(props: StyledProps) => props.theme.opacity.mediumEmphasis};
`
