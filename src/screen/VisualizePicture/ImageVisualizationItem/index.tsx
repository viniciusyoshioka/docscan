import { ComponentClass, useEffect, useMemo, useState } from "react"
import { Dimensions, Image, StatusBar, useWindowDimensions } from "react-native"
import FastImage, { FastImageProps, Source } from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Reanimated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { Screen } from "../../../components"


const AnimatedFastImage = Reanimated.createAnimatedComponent(FastImage as ComponentClass<FastImageProps>)


export interface ImageVisualizationItemProps {
    source: Source;
    minZoom?: number;
    maxZoom?: number;
    doubleTabZoom?: number;
    zoomMargin?: number;
    allowZoomOut?: boolean;
    onZoomActivated?: () => void;
    onZoomDeactivated?: () => void;
}


// TODO implement focal when zooming
export function ImageVisualizationItem(props: ImageVisualizationItemProps) {


    const { width, height } = useWindowDimensions()

    const minZoom = useMemo(() => props.minZoom ?? 0.9, [props.minZoom])
    const maxZoom = useMemo(() => props.maxZoom ?? 10, [props.maxZoom])
    const doubleTabZoom = useMemo(() => props.doubleTabZoom ?? 2, [props.doubleTabZoom])
    const zoomMargin = useMemo(() => props.zoomMargin ?? 0, [props.zoomMargin])
    const allowZoomOut = useMemo(() => props.allowZoomOut ?? false, [props.allowZoomOut])
    const windowWidth = useMemo(() => width, [width])
    const windowHeight = useMemo(() => {
        const { height: screenHeight } = Dimensions.get("screen")
        const statusBarHeight = StatusBar.currentHeight ?? 0

        if (screenHeight === height) {
            return height - statusBarHeight
        }
        return height
    }, [height, StatusBar.currentHeight])
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

            if (!allowZoomOut && zoom.value < 1) {
                zoom.value = withTiming(1, { duration: ANIMATION_DURATION })
                savedZoom.value = withTiming(1, { duration: ANIMATION_DURATION })

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

            savedZoom.value = zoom.value
            runOnJS(setIsPanGestureEnabled)(true)
        })

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .maxDistance(20)
        .maxDuration(200)
        .onStart(event => {
            if (event.numberOfPointers !== 1) {
                return
            }

            if (zoom.value !== 1) {
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
                return
            }

            // if (imageWidth.value * doubleTabZoom > windowWidth) {
            //     const sizeOutsideScreenX = ((imageWidth.value * doubleTabZoom) - windowWidth) / (2 * doubleTabZoom)
            //     const dx = (sizeOutsideScreenX - event.x) + (event.x / doubleTabZoom)
            //     const dx = -(event.x - (imageWidth.value / 2)) / doubleTabZoom
            //     translateX.value = withTiming(dx, { duration: ANIMATION_DURATION })
            // }
            // if (imageHeight.value * doubleTabZoom > windowHeight) {
            //     const sizeOutsideScreenY = ((imageHeight.value * doubleTabZoom) - windowHeight) / (2 * doubleTabZoom)
            //     const dy = (sizeOutsideScreenY - event.y) + (event.y / doubleTabZoom)
            //     const dy = -(event.y - (imageHeight.value / 2)) / doubleTabZoom
            //     translateY.value = withTiming(dy, { duration: ANIMATION_DURATION })
            // }

            zoom.value = withTiming(doubleTabZoom, { duration: ANIMATION_DURATION })
            savedZoom.value = withTiming(doubleTabZoom, { duration: ANIMATION_DURATION })

            runOnJS(setIsPanGestureEnabled)(true)
            if (props.onZoomActivated) {
                runOnJS(props.onZoomActivated)()
            }
        })

    const panGesture = Gesture.Pan()
        .enabled(isPanGestureEnabled)
        .onStart(event => {
            initialTranslationX.value = translateX.value
            initialTranslationY.value = translateY.value
        })
        .onUpdate(event => {
            if (imageWidth.value * zoom.value > windowWidth) {
                translateX.value = initialTranslationX.value + (event.translationX / zoom.value)
            } else {
                translateX.value = withTiming(0, { duration: ANIMATION_DURATION })
            }

            if (imageHeight.value * zoom.value > windowHeight) {
                translateY.value = initialTranslationY.value + (event.translationY / zoom.value)
            } else {
                translateY.value = withTiming(0, { duration: ANIMATION_DURATION })
            }
        })

    useAnimatedReaction(
        () => ({
            translateX: translateX.value,
            translateY: translateY.value,
        }),
        (current, previous) => {
            const margin = (zoom.value === 0) ? 0 : (zoomMargin / zoom.value)

            if (imageWidth.value * zoom.value > windowWidth) {
                const sizeOutsideScreenX = ((imageWidth.value * zoom.value) - windowWidth) / (2 * zoom.value)
                const limitRight = sizeOutsideScreenX + margin
                const limitLeft = (-sizeOutsideScreenX - margin)

                if (current.translateX > limitRight) translateX.value = limitRight
                if (current.translateX < limitLeft) translateX.value = limitLeft
            }

            if (imageHeight.value * zoom.value > windowHeight) {
                const sizeOutsideScreenY = ((imageHeight.value * zoom.value) - windowHeight) / (2 * zoom.value)
                const limitTop = sizeOutsideScreenY + margin
                const limitBottom = (-sizeOutsideScreenY - margin)

                if (current.translateY > limitTop) translateY.value = limitTop
                if (current.translateY < limitBottom) translateY.value = limitBottom
            }
        },
        [translateX, translateY]
    )

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
            const imageRatio = widthSize / heightSize

            let newImageWidth = windowWidth
            let newImageHeight = windowWidth / imageRatio
            if (newImageHeight > windowHeight) {
                newImageWidth = windowHeight * imageRatio
                newImageHeight = windowHeight
            }

            imageWidth.value = newImageWidth
            imageHeight.value = newImageHeight
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
