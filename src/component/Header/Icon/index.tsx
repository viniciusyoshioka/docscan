import React, { useContext } from "react"
import Icon from "react-native-vector-icons/Ionicons"

import { ThemeContext } from "../../../service/theme"


export const headerIconSize = 25


export interface HeaderIconProps {
    iconName: string,
    iconSize?: number
}


export function HeaderIcon(props: HeaderIconProps) {


    const { color } = useContext(ThemeContext)


    return (
        <Icon 
            name={props.iconName} 
            size={props.iconSize || headerIconSize} 
            color={color.iconLight} />
    )
}
