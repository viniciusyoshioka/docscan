import React from "react"
import { ActivityIndicator } from "react-native"
import styled from "styled-components/native"

import { useColorTheme } from "../../services/theme"


const LoadingIndicatorView = styled.View`
    align-items: center;
    justify-content: center;
    padding-vertical: 16px;
`


export function LoadingIndicator() {


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
