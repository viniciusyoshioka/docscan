import React from "react"
import { TouchableOpacityProps } from "react-native"

import { Icon } from "../../../components"
import { ButtonBase, IndexText, IndexView } from "./style"


export interface ControlButtonProps extends TouchableOpacityProps {
    icon?: string;
    size?: number;
    indexCount?: string;
}


export const ControlButton = (props: ControlButtonProps) => {
    return (
        <ButtonBase {...props}>
            <IndexView>
                {props.icon && (
                    <Icon
                        iconName={props.icon}
                        iconSize={props.size || 24}
                        iconColor={"rgb(255, 255, 255)"}
                    />
                )}

                {props.indexCount && (
                    <IndexText>
                        {props.indexCount}
                    </IndexText>
                )}
            </IndexView>
        </ButtonBase>
    )
}
