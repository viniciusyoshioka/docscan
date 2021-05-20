import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import styled from "styled-components/native"

import { cameraControlIconColor, CameraControlIconProps, cameraControlIconSize } from "./Icon"


export const CameraControlButtonBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
`


export const CameraControlViewButtonIndex = styled.View`
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
`


export interface CameraControlButtonProps extends TouchableOpacityProps, CameraControlIconProps { }


export function CameraControlButton(props: CameraControlButtonProps) {
    return (
        <CameraControlButtonBase {...props}>
            <Icon
                name={props.iconName}
                size={props.iconSize || cameraControlIconSize}
                color={props.iconColor || cameraControlIconColor}
            />
        </CameraControlButtonBase>
    )
}
