import React from "react"
import { StyleProp, ViewStyle } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"

import { useAppTheme } from "../../services/theme"
import { IconGroup } from "../../types"


function getIconComponent(iconGroup: IconGroup) {
    switch (iconGroup) {
        case "material":
            return MaterialIcon
        case "material-community":
            return MaterialCommunityIcon
        case "ionicons":
            return Ionicons
        default:
            throw new Error(`Invalid icon group "${iconGroup}"`)
    }
}


export interface IconProps {
    iconName: string;
    iconGroup?: IconGroup;
    iconSize?: number;
    iconColor?: string;
    iconStyle?: StyleProp<ViewStyle>;
}


export interface OptionalIconProps {
    iconName?: string;
    iconGroup?: IconGroup;
    iconSize?: number;
    iconColor?: string;
    iconStyle?: StyleProp<ViewStyle>;
}


export const Icon = (props: IconProps) => {


    const IconComponent = getIconComponent(props.iconGroup || "material")


    const { color } = useAppTheme()


    return (
        <IconComponent
            name={props.iconName}
            size={props.iconSize || 24}
            color={props.iconColor || color.screen_color}
            style={props.iconStyle}
        />
    )
}
