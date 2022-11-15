import React from "react"
import { ViewProps } from "react-native"

import { FocusIndicatorBase } from "./style"


export const FOCUS_INDICATOR_SIZE = 64


export interface FocusIndicatorProps extends ViewProps {
    isFocusing: boolean;
    focusPosX: number;
    focusPosY: number;
}


export function FocusIndicator(props: FocusIndicatorProps) {

    if (!props.isFocusing) {
        return null
    }

    return (
        <FocusIndicatorBase
            {...props}
            style={[ {
                transform: [
                    { translateX: props.focusPosX - (FOCUS_INDICATOR_SIZE / 2) },
                    { translateY: props.focusPosY - (FOCUS_INDICATOR_SIZE / 2) }
                ]
            }, props.style]}
        />
    )
}
