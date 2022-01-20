import React from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

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
                        name={props.icon}
                        size={props.size || 24}
                        color={"rgb(255, 255, 255)"}
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
