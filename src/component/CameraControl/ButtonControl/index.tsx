import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

import { CameraControlButtonBase, CameraControlViewButtonIndex } from "./style"
import { CameraControlIconProps, cameraControlIconSize } from "../Icon"
import { useTheme } from "../../../service/theme"


export interface CameraControlButtonProps extends TouchableOpacityProps, CameraControlIconProps {}


export function CameraControlButton(props: CameraControlButtonProps) {


    const { color } = useTheme()


    return (
        <CameraControlButtonBase {...props}>
            <Icon 
                name={props.iconName} 
                size={props.iconSize || cameraControlIconSize} 
                color={color.colorLight}
            />
        </CameraControlButtonBase>
    )
}


export { CameraControlButtonBase, CameraControlViewButtonIndex }
