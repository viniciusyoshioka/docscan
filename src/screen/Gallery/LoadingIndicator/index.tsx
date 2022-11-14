import React from "react"
import { ActivityIndicator } from "react-native"

import { useAppTheme } from "../../../services/theme"
import { LoadingIndicatorView } from "./style"


export const LoadingIndicator = () => {


    const { color, opacity } = useAppTheme()


    return (
        <LoadingIndicatorView>
            <ActivityIndicator
                size={"small"}
                color={color.screen_color}
                style={{ opacity: opacity.mediumEmphasis }}
            />
        </LoadingIndicatorView>
    )
}
