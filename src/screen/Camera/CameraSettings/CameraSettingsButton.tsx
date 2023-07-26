import { ExtendableIconProps, Icon, Text } from "@elementium/native"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"


export const CAMERA_SETTINGS_BUTTON_HEIGHT = 80


export interface CameraSettingsButtonProps extends TouchableOpacityProps, Omit<ExtendableIconProps, "style"> {
    optionName: string;
}


export function CameraSettingsButton(props: CameraSettingsButtonProps) {


    const contentColor = props.iconColor ?? "white"


    return (
        <TouchableOpacity
            activeOpacity={0.6}
            {...props}
            style={[styles.container, props.style]}
        >
            <Icon
                name={props.iconName}
                group={props.iconGroup}
                size={props.iconSize ?? 24}
                color={contentColor}
                style={{ flex: 1 }}
            />

            <Text
                variant={"label"}
                size={"medium"}
                numberOfLines={2}
                style={{ flex: 1, color: contentColor, textAlign: "center" }}
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
