import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import styled from "styled-components/native"

import { cameraControlIconColor, CameraControlIconProps, cameraControlIconSize } from "./Icon"


export const CameraControlButtonBase = styled.TouchableOpacity`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50px;
`


export const CameraControlViewButtonIndex = styled.View`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
`


export interface CameraControlButtonProps extends TouchableOpacityProps, CameraControlIconProps {}


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
