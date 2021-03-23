import React, { useContext } from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

import { CameraControlButtonBase } from "./style"
import { CameraControlIconProps, cameraControlIconSize } from "../Icon"
import { ThemeContext } from "../../../service/theme"


export interface CameraControlButtonProps extends TouchableOpacityProps, CameraControlIconProps {}


export function CameraControlButton(props: CameraControlButtonProps) {


    const { color } = useContext(ThemeContext)


    return (
        <CameraControlButtonBase {...props}>
            <Icon 
                name={props.iconName} 
                size={props.iconSize || cameraControlIconSize} 
                color={color.iconLight} />
        </CameraControlButtonBase>
    )
}


export { CameraControlButtonBase }
