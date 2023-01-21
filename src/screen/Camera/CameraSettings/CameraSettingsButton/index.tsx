import { TouchableOpacityProps } from "react-native"

import { Icon } from "../../../../components"
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
                    iconName={props.iconName}
                    iconSize={props.iconSize || 24}
                    iconColor={"rgb(255, 255, 255)"}
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
