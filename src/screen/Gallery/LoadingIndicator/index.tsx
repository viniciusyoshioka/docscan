import React from "react"
import { ActivityIndicator } from "react-native"

import { useColorTheme } from "../../../services/theme"
import { LoadingIndicatorView } from "./style"


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoadingIndicatorProps { }


export const LoadingIndicator = (props: LoadingIndicatorProps) => {


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
