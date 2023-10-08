import { Icon } from "@elementium/native"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"
import { Text } from "react-native-paper"


export const CAMERA_SETTINGS_BUTTON_HEIGHT = 80


export interface CameraSettingsButtonProps extends TouchableOpacityProps {
    icon: string;
    optionName: string;
}


export function CameraSettingsButton(props: CameraSettingsButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            {...props}
            style={[styles.container, props.style]}
        >
            <Icon
                name={props.icon}
                group={"material-community"}
                color={"white"}
                style={{ flex: 1 }}
            />

            <Text
                variant={"labelMedium"}
                numberOfLines={2}
                style={{ flex: 1, color: "white", textAlign: "center" }}
                children={props.optionName}
            />
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: CAMERA_SETTINGS_BUTTON_HEIGHT,
        height: CAMERA_SETTINGS_BUTTON_HEIGHT,
        padding: 8,
    },
})
