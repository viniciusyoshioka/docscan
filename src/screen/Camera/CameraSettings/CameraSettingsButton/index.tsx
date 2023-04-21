import { ExtendableIconProps, Icon, Text } from "@elementium/native"
import { TouchableOpacityProps } from "react-native"

import { CameraSettingsButtonBase } from "./style"


export { CAMERA_SETTINGS_BUTTON_HEIGHT } from "./style"


export interface CameraSettingsButtonProps extends TouchableOpacityProps, Omit<ExtendableIconProps, "style"> {
    optionName: string;
}


export function CameraSettingsButton(props: CameraSettingsButtonProps) {


    const contentColor = props.iconColor ?? "white"


    return (
        <CameraSettingsButtonBase activeOpacity={0.6} {...props}>
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
        </CameraSettingsButtonBase>
    )
}
