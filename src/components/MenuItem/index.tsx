import React from "react"
import { RectButtonProps } from "react-native-gesture-handler"

import { useAppTheme } from "../../services/theme"
import { MenuItemBase, MenuItemText } from "./style"


export interface MenuItemProps extends RectButtonProps {
    text: string;
}


export const MenuItem = (props: MenuItemProps) => {


    const { color } = useAppTheme()


    return (
        <MenuItemBase rippleColor={color.menuItem_ripple} {...props}>
            <MenuItemText numberOfLines={1}>
                {props.text}
            </MenuItemText>
        </MenuItemBase>
    )
}
