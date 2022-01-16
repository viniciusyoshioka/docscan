import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

import { ButtonBase, ButtonChildrenWrapper, ButtonText } from "./style"


export interface CameraSettingsButtonProps extends TouchableOpacityProps {
    optionName: string;
    iconName: string;
    iconSize?: number;
}


export function CameraSettingsButton(props: CameraSettingsButtonProps) {
    return (
        <ButtonBase activeOpacity={0.6} {...props}>
            <ButtonChildrenWrapper>
                <Icon
                    name={props.iconName}
                    size={props.iconSize || 24}
                    color={"rgb(255, 255, 255)"}
                />
            </ButtonChildrenWrapper>

            <ButtonChildrenWrapper>
                <ButtonText numberOfLines={2}>
                    {props.optionName}
                </ButtonText>
            </ButtonChildrenWrapper>
        </ButtonBase>
    )
}
