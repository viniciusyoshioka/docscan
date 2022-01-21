import React from "react"
import { ActivityIndicator } from "react-native"

import { useColorTheme } from "../../../services/theme"
import { LoadingIndicatorView } from "./style"


export const LoadingIndicator = () => {


    const { color, opacity } = useColorTheme()


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
