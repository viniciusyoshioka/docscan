import { RectButtonProps } from "react-native-gesture-handler"

import { MenuItemBase, MenuItemText } from "./style"


export interface MenuItemProps extends RectButtonProps {
    text: string;
}


export function MenuItem(props: MenuItemProps) {
    return (
        <MenuItemBase {...props}>
            <MenuItemText
                numberOfLines={1}
                variant={"label"}
                size={"large"}
            >
                {props.text}
            </MenuItemText>
        </MenuItemBase>
    )
}
