import { Text } from "@elementium/native"
import { View } from "react-native"
import styled from "styled-components/native"

import { HEADER_HEIGHT } from "../../components"
import { StyledProps } from "../../theme"


export const CameraTextWrapper = styled(View)`
    flex: 1;
    padding: 16px;
    margin-top: ${HEADER_HEIGHT}px;
`


export const CameraButtonWrapper = styled(View)`
    align-items: center;
    justify-content: center;
    padding: 16px;
    gap: 8px;
`


export const CameraWrapper = View


export const CameraMessageTitle = styled(Text)<StyledProps>`
    width: 100%;
    margin-bottom: 16px;
    font-weight: bold;
    text-align: center;
    color: ${props => props.theme.color.onBackground};
`


export const CameraMessageText = styled(Text)<StyledProps>`
    margin-bottom: 4px;
    color: ${props => props.theme.color.onBackground};
`
