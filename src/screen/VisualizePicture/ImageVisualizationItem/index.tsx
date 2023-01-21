import { Image, ImageSourcePropType, useWindowDimensions } from "react-native"

import { Screen } from "../../../components"


export interface ImageVisualizationItemProps {
    source: ImageSourcePropType;
}


export function ImageVisualizationItem(props: ImageVisualizationItemProps) {


    const { width } = useWindowDimensions()


    return (
        <Screen style={{ width }}>
            <Image
                source={props.source}
                resizeMode={"contain"}
                style={{ flex: 1 }}
            />
        </Screen>
    )
}
