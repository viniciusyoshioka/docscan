import CheckBox from "@react-native-community/checkbox"
import { TouchableOpacityProps } from "react-native"

import { useAppTheme } from "../../theme"
import { Button, Text } from "./style"


export interface CheckButtonProps extends TouchableOpacityProps {
    text?: string;
    value?: boolean;
    onValueChange?: (newValue: boolean) => void;
}


export const CheckButton = (props: CheckButtonProps) => {


    const { color } = useAppTheme()


    return (
        <Button activeOpacity={0.8} {...props}>
            <CheckBox
                value={props.value}
                onValueChange={props.onValueChange}
                tintColors={{
                    true: color.primary,
                    false: color.onSurface,
                }}
            />

            {props.text && (
                <Text>{props.text}</Text>
            )}
        </Button>
    )
}
