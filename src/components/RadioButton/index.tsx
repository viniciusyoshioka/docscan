import { Icon } from "@elementium/native"
import { TouchableOpacityProps } from "react-native"

import { useAppTheme } from "../../theme"
import { Button, Text } from "./style"


export interface RadioButtonProps extends TouchableOpacityProps {
    text?: string;
    value?: boolean;
}


export const RadioButton = (props: RadioButtonProps) => {


    const { color } = useAppTheme()


    return (
        <Button {...props} activeOpacity={0.7}>
            <Icon
                name={props.value ? "radio-button-checked" : "radio-button-unchecked"}
                color={props.value ? color.primary : color.onSurface}
            />

            {props.text && (
                <Text>{props.text}</Text>
            )}
        </Button>
    )
}
