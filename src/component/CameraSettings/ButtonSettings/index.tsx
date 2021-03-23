import React, { ReactChild } from "react"
import { TouchableOpacityProps } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

import { ButtonSettingsBase, Description, ViewSeparator } from "./style"
import { cameraSettingsIconSize } from "../Icon"


export interface ButtonSettingsProps extends TouchableOpacityProps {
    iconName?: string,
    iconSize?: number,
    description?: string,
    children?: ReactChild,
}


export function ButtonSettings(props: ButtonSettingsProps) {
    return (
        <ButtonSettingsBase {...props} activeOpacity={0.7}>
            <>
                <ViewSeparator>
                    {props.iconName 
                        ? (<Icon 
                            name={props.iconName} 
                            size={props.iconSize || cameraSettingsIconSize} 
                            color={"rgb(255, 255, 255)"} />)
                        : props.children}
                </ViewSeparator>

                {props.description && (
                    <ViewSeparator style={{justifyContent: "flex-start"}}>
                        <Description numberOfLines={2}>
                            {props.description}
                        </Description>
                    </ViewSeparator>
                )}
            </>
        </ButtonSettingsBase>
    )
}


export { ButtonSettingsBase }
