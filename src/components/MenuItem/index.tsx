import { RectButtonProps } from "react-native-gesture-handler"

import { MenuItemBase, MenuItemText } from "./style"


export interface MenuItemProps extends RectButtonProps {
    text: string;
}


export const MenuItem = (props: MenuItemProps) => (
    <MenuItemBase {...props}>
        <MenuItemText numberOfLines={1}>
            {props.text}
        </MenuItemText>
    </MenuItemBase>
)
