import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import styled from "styled-components/native"

import { cameraSettingsIconColor, CameraSettingsIconProps, cameraSettingsIconSize } from "./Icon"


export const ButtonSettingsBase = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin-bottom: 4px;
    margin-right: 4px;
`


export interface ButtonSettingsProps extends TouchableOpacityProps, CameraSettingsIconProps { }


export function ButtonSettings(props: ButtonSettingsProps) {
    return (
        <ButtonSettingsBase {...props} activeOpacity={0.5}>
            <Icon
                name={props.iconName}
                size={props.iconSize || cameraSettingsIconSize}
                color={props.iconColor || cameraSettingsIconColor}
            />
        </ButtonSettingsBase>
    )
}
