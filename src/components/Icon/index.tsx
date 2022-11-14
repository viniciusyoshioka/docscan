import React from "react"
import { StyleProp, ViewStyle } from "react-native"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"

import { IconGroup } from "../../types"
import { useAppTheme } from "../../services/theme"


function getIconComponent(iconGroup: IconGroup) {
    switch (iconGroup) {
        case "material":
            return MaterialIcon
        case "material-community":
            return MaterialCommunityIcon
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
