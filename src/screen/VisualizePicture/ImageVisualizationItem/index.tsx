import { ComponentClass, useMemo } from "react"
import { ImageRequireSource, useWindowDimensions } from "react-native"
import FastImage, { FastImageProps, Source } from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Reanimated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated"

import { Screen } from "../../../components"


const AnimatedFastImage = Reanimated.createAnimatedComponent(FastImage as ComponentClass<FastImageProps>)


export interface ImageVisualizationItemProps {
    source: Source | ImageRequireSource;
    minZoom?: number;
    maxZoom?: number;
    onZoomActivated?: () => void;
    onZoomDeactivated?: () => void;
}


export function ImageVisualizationItem(props: ImageVisualizationItemProps) {


    const { width } = useWindowDimensions()

    const minZoom = useMemo(() => props.minZoom ?? 0.9, [props.minZoom])
    const maxZoom = useMemo(() => props.maxZoom ?? 10, [props.maxZoom])

    const zoom = useSharedValue(1)
    const savedZoom = useSharedValue(1)


    const pinchGesture = Gesture.Pinch()
        .onStart(event => {
            if (event.numberOfPointers !== 2) {
                return
            }

            if (props.onZoomActivated) {
                runOnJS(props.onZoomActivated)()
            }
        })
        .onUpdate(event => {
            if (event.numberOfPointers !== 2) {
                return
            }

            zoom.value = savedZoom.value * event.scale
            if (zoom.value < minZoom) {
                zoom.value = minZoom
            }
            if (zoom.value > maxZoom) {
                zoom.value = maxZoom
            }
        })
        .onEnd((event, success) => {
            if (event.numberOfPointers !== 2) {
                return
            }

            if (zoom.value < 1) {
                zoom.value = 1
            }
            savedZoom.value = zoom.value

            if (zoom.value === 1) {
                if (props.onZoomDeactivated) {
                    runOnJS(props.onZoomDeactivated)()
                }
            }
        })


    const imageStyle = useAnimatedStyle(() => ({
        flex: 1,
        transform: [
            { scale: zoom.value },
        ]
    }))


    return (
        <Screen style={{ width }}>
            <GestureDetector gesture={pinchGesture}>
                <AnimatedFastImage
                    source={props.source}
                    resizeMode={"contain"}
                    style={imageStyle}
                />
            </GestureDetector>
        </Screen>
    )
}
