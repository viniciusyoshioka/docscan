import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

import { CameraSettingsButtonBase } from "./style"


export interface CameraSettingsButtonProps extends TouchableOpacityProps {
    icon: string;
    size?: number;
}


export function CameraSettingsButton(props: CameraSettingsButtonProps) {
    return (
        <CameraSettingsButtonBase activeOpacity={0.6} {...props}>
            <Icon
                name={props.icon}
                size={props.size || 24}
                color={"rgb(255, 255, 255)"}
            />
        </CameraSettingsButtonBase>
    )
}
