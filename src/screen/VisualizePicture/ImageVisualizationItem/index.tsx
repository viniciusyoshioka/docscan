import { ComponentClass, useEffect, useMemo, useState } from "react"
import { Dimensions, Image, StatusBar, useWindowDimensions } from "react-native"
import FastImage, { FastImageProps, Source } from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Reanimated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { HEADER_HEIGHT, Screen } from "../../../components"


const AnimatedFastImage = Reanimated.createAnimatedComponent(FastImage as ComponentClass<FastImageProps>)


export interface ImageVisualizationItemProps {
    source: Source;
    minZoom?: number;
    maxZoom?: number;
    doubleTabZoom?: number;
    zoomMargin?: number;
    onZoomActivated?: () => void;
    onZoomDeactivated?: () => void;
}


export function ImageVisualizationItem(props: ImageVisualizationItemProps) {


    const { width, height } = useWindowDimensions()

    const minZoom = useMemo(() => props.minZoom ?? 0.9, [props.minZoom])
    const maxZoom = useMemo(() => props.maxZoom ?? 10, [props.maxZoom])
    const doubleTabZoom = useMemo(() => props.doubleTabZoom ?? 2, [props.doubleTabZoom])
    const zoomMargin = useMemo(() => props.zoomMargin ?? 0, [props.zoomMargin])
    const windowWidth = useMemo(() => width, [width])
    const windowHeight = useMemo(() => {
        const { height: screenHeight } = Dimensions.get("screen")
        const statusBarHeight = StatusBar.currentHeight ?? 0

        if (screenHeight === height) {
            return height - HEADER_HEIGHT - statusBarHeight
        }
        return height - HEADER_HEIGHT
    }, [height, HEADER_HEIGHT, StatusBar.currentHeight])
    const ANIMATION_DURATION = 150

    const zoom = useSharedValue(1)
    const savedZoom = useSharedValue(1)
    const initialTranslationX = useSharedValue(0)
    const initialTranslationY = useSharedValue(0)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const imageWidth = useSharedValue(0)
    const imageHeight = useSharedValue(0)

    const [isPanGestureEnabled, setIsPanGestureEnabled] = useState(false)


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
                zoom.value = withTiming(1, { duration: ANIMATION_DURATION })
                savedZoom.value = withTiming(1, { duration: ANIMATION_DURATION })
            } else {
                savedZoom.value = zoom.value
            }

            if (zoom.value === 1) {
                initialTranslationX.value = 0
                initialTranslationY.value = 0
                translateX.value = 0
                translateY.value = 0

                runOnJS(setIsPanGestureEnabled)(false)
                if (props.onZoomDeactivated) {
                    runOnJS(props.onZoomDeactivated)()
                }
                return
            }

            runOnJS(setIsPanGestureEnabled)(true)
        })

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .maxDistance(20)
        .maxDuration(200)
        .onStart(event => {
            if (zoom.value === 1) {
                zoom.value = withTiming(doubleTabZoom, { duration: ANIMATION_DURATION })
                savedZoom.value = withTiming(doubleTabZoom, { duration: ANIMATION_DURATION })

                runOnJS(setIsPanGestureEnabled)(true)
                if (props.onZoomActivated) {
                    runOnJS(props.onZoomActivated)()
                }
                return
            }

            zoom.value = withTiming(1, { duration: ANIMATION_DURATION })
            savedZoom.value = withTiming(1, { duration: ANIMATION_DURATION })
            initialTranslationX.value = withTiming(0, { duration: ANIMATION_DURATION })
            initialTranslationY.value = withTiming(0, { duration: ANIMATION_DURATION })
            translateX.value = withTiming(0, { duration: ANIMATION_DURATION })
            translateY.value = withTiming(0, { duration: ANIMATION_DURATION })

            runOnJS(setIsPanGestureEnabled)(false)
            if (props.onZoomDeactivated) {
                runOnJS(props.onZoomDeactivated)()
            }
        })

    const panGesture = Gesture.Pan()
        .enabled(isPanGestureEnabled)
        .onStart(event => {
            initialTranslationX.value = translateX.value
            initialTranslationY.value = translateY.value
        })
        .onUpdate(event => {
            const limitX = ((imageWidth.value * zoom.value) - windowWidth) / (2 * zoom.value)
            const limitY = ((imageHeight.value * zoom.value) - windowHeight) / (2 * zoom.value)

            const margin = zoomMargin / zoom.value

            if (imageWidth.value * zoom.value > windowWidth) {
                translateX.value = initialTranslationX.value + (event.translationX / zoom.value)
                if (translateX.value > limitX + margin) {
                    translateX.value = limitX + margin
                }
                if (translateX.value < (limitX * -1) - margin) {
                    translateX.value = (limitX * -1) - margin
                }
            } else {
                translateX.value = withTiming(0, { duration: ANIMATION_DURATION })
            }

            if (imageHeight.value * zoom.value > windowHeight) {
                translateY.value = initialTranslationY.value + (event.translationY / zoom.value)
                if (translateY.value > limitY + margin) {
                    translateY.value = limitY + margin
                }
                if (translateY.value < (limitY * -1) - margin) {
                    translateY.value = (limitY * -1) - margin
                }
            } else {
                translateY.value = withTiming(0, { duration: ANIMATION_DURATION })
            }
        })


    const raceComposedGestures = Gesture.Race(pinchGesture, doubleTapGesture)
    const simultaneousComposedGestures = Gesture.Simultaneous(raceComposedGestures, panGesture)


    const imageStyle = useAnimatedStyle(() => ({
        flex: 1,
        transform: [
            { scale: zoom.value },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ]
    }))


    useEffect(() => {
        function onSuccess(widthSize: number, heightSize: number) {
            // TODO improve function to get image width and height fot partrait and landscape
            const imageRatio = widthSize / heightSize

            if (widthSize > heightSize) {
                imageWidth.value = width
                imageHeight.value = width / imageRatio
                return
            }
            if (widthSize < heightSize) {
                if (windowHeight * imageRatio >= windowWidth) {
                    imageWidth.value = width
                    imageHeight.value = width / imageRatio
                } else {
                    imageWidth.value = windowHeight * imageRatio
                    imageHeight.value = windowHeight
                }
                return
            }

            if (windowWidth <= windowHeight) {
                imageWidth.value = width
                imageHeight.value = width / imageRatio
            } else {
                imageWidth.value = windowHeight * imageRatio
                imageHeight.value = windowHeight
            }
        }

        function onError(error: unknown) {
            // TODO handle error
            console.log("Error getting image size", error)
        }

        if (props.source.uri) {
            Image.getSize(props.source.uri, onSuccess, onError)
        }
    }, [])


    return (
        <Screen style={{ width }}>
            <GestureDetector gesture={simultaneousComposedGestures}>
                <AnimatedFastImage
                    source={props.source}
                    resizeMode={"contain"}
                    style={imageStyle}
                />
            </GestureDetector>
        </Screen>
    )
}
