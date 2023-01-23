import { ImageRequireSource, useWindowDimensions } from "react-native"
import FastImage, { Source } from "react-native-fast-image"

import { Screen } from "../../../components"


export interface ImageVisualizationItemProps {
    source: Source | ImageRequireSource;
}


export function ImageVisualizationItem(props: ImageVisualizationItemProps) {


    const { width } = useWindowDimensions()


    return (
        <Screen style={{ width }}>
            <FastImage
                source={props.source}
                resizeMode={"contain"}
                style={{ flex: 1 }}
            />
        </Screen>
    )
}
