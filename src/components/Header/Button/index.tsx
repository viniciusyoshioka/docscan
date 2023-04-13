import { Icon, IconGroup } from "@elementium/native"
import { BorderlessButtonProps } from "react-native-gesture-handler"

import { useAppTheme } from "../../../theme"
import { HeaderButtonBase } from "./style"


export interface HeaderButtonProps extends BorderlessButtonProps {
    iconName: string;
    iconGroup?: IconGroup;
    iconSize?: number;
    iconColor?: string;
}


export const HeaderButton = (props: HeaderButtonProps) => {


    const { color } = useAppTheme()


    return (
        <HeaderButtonBase {...props}>
            <Icon
                name={props.iconName}
                group={props.iconGroup}
                size={props.iconSize ?? 24}
                color={props.iconColor ?? color.onSurface}
            />
        </HeaderButtonBase>
    )
}
