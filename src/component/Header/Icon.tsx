import React from "react"
import Icon from "react-native-vector-icons/Ionicons"

import { useTheme } from "../../service/theme"


export const headerIconSize = 25


export interface HeaderIconProps {
    iconName: string,
    iconSize?: number
}


export function HeaderIcon(props: HeaderIconProps) {


    const { color } = useTheme()


    return (
        <Icon 
            name={props.iconName} 
            size={props.iconSize || headerIconSize} 
            color={color.colorLight}
        />
    )
}
