import React from "react"
import { Image, ImageSourcePropType, useWindowDimensions } from "react-native"

import { Screen } from "../../../components/Screen"


export interface ImageVisualizationItemProps {
    source: ImageSourcePropType;
}


export const ImageVisualizationItem = (props: ImageVisualizationItemProps) => {
    return (
        <Screen style={{ width: useWindowDimensions().width }}>
            <Image
                source={props.source}
                resizeMode={"contain"}
                style={{ flex: 1 }}
            />
        </Screen>
    )
}
