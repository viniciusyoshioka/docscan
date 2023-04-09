import { Icon } from "@elementium/native"
import { TouchableOpacityProps } from "react-native"

import { useAppTheme } from "../../../services/theme"
import { ShowPasswordButtonBase } from "./style"


export interface ShowPasswordButtonProps extends TouchableOpacityProps {
    showPassword: boolean;
    isFocused: boolean;
}


export const ShowPasswordButton = (props: ShowPasswordButtonProps) => {


    const { color, opacity } = useAppTheme()


    return (
        <ShowPasswordButtonBase activeOpacity={0.7} {...props}>
            <Icon
                name={props.showPassword ? "visibility" : "visibility-off"}
                size={24}
                color={color.input_color}
                style={{ opacity: opacity.highEmphasis }}
            />
        </ShowPasswordButtonBase>
    )
}
