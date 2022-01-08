import React from "react"
import { RectButtonProps } from "react-native-gesture-handler"

import { useColorTheme } from "../../services/theme"
import { MenuItemBase, MenuItemText } from "./style"


export interface MenuItemProps extends RectButtonProps {
    text: string,
}


export function MenuItem(props: MenuItemProps) {


    const { color } = useColorTheme()


    return (
        <MenuItemBase rippleColor={color.menuItem_ripple} {...props}>
            <MenuItemText numberOfLines={1}>
                {props.text}
            </MenuItemText>
        </MenuItemBase>
    )
}
