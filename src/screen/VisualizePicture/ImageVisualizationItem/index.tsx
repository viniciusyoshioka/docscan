import { ComponentClass, useEffect, useMemo, useState } from "react"
import { Image, StyleProp, View, ViewStyle, useWindowDimensions } from "react-native"
import FastImage, { FastImageProps, Source } from "react-native-fast-image"
import {
    Gesture,
    GestureDetector,
    GestureStateChangeEvent,
    TapGestureHandlerEventPayload
} from "react-native-gesture-handler"
import Reanimated, {
    cancelAnimation,
    clamp,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
    withTiming
} from "react-native-reanimated"

import { TIMING_CONFIG } from "./animation-config"


const AnimatedFastImage = Reanimated.createAnimatedComponent(FastImage as ComponentClass<FastImageProps>)


export interface ImageVisualizationItemProps {
    source: Source
    minZoom?: number
    maxZoom?: number
    doubleTabZoom?: number
    zoomMargin?: number
    allowZoomOut?: boolean
    onZoomActivated?: () => void
    onZoomDeactivated?: () => void
    onSingleTap?: (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => void
    onError?: (error?: unknown) => void
    style?: StyleProp<ViewStyle>
}


// TODO implement focal when zooming
export function ImageVisualizationItem(props: ImageVisualizationItemProps) {


    const minZoom = useMemo(() => props.minZoom ?? 0.9, [props.minZoom])
    const maxZoom = useMemo(() => props.maxZoom ?? 10, [props.maxZoom])
    const doubleTabZoom = useMemo(() => props.doubleTabZoom ?? 2, [props.doubleTabZoom])
    const zoomMargin = useMemo(() => props.zoomMargin ?? 0, [props.zoomMargin])
    const allowZoomOut = useMemo(() => props.allowZoomOut ?? false, [props.allowZoomOut])

    const { width } = useWindowDimensions()

    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)
    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)

    const zoom = useSharedValue(1)
    const savedZoom = useSharedValue(1)
    const initialTranslationX = useSharedValue(0)
    const initialTranslationY = useSharedValue(0)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    const [isPanGestureEnabled, setIsPanGestureEnabled] = useState(false)


    function getBoundaries(newZoom: number) {
        "worklet"
        const margin = (newZoom === 0) ? 0 : zoomMargin
        const limitX = (imageWidth * newZoom - windowWidth) / 2
        const limitY = (imageHeight * newZoom - windowHeight) / 2
        return {
            x: limitX + margin,
            y: limitY + margin,
        }
    }


    const pinchGesture = Gesture.Pinch()
        .onStart(event => {
            if (event.numberOfPointers !== 2) {
                return
            }

            if (props.onZoomActivated) {
                runOnJS(props.onZoomActivated)()
            }
        })
        .onChange(event => {
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
                zoom.value = withTiming(1, TIMING_CONFIG)
                savedZoom.value = withTiming(1, TIMING_CONFIG)

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

    const singleTapGesture = Gesture.Tap()
        .numberOfTaps(1)
        .maxDistance(20)
        .maxDuration(200)
        .onStart(event => {
            if (event.numberOfPointers !== 1) {
                return
            }

            if (props.onSingleTap) {
                runOnJS(props.onSingleTap)(event)
            }
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
                zoom.value = withTiming(1, TIMING_CONFIG)
                savedZoom.value = withTiming(1, TIMING_CONFIG)
                initialTranslationX.value = withTiming(0, TIMING_CONFIG)
                initialTranslationY.value = withTiming(0, TIMING_CONFIG)
                translateX.value = withTiming(0, TIMING_CONFIG)
                translateY.value = withTiming(0, TIMING_CONFIG)

                runOnJS(setIsPanGestureEnabled)(false)
                if (props.onZoomDeactivated) {
                    runOnJS(props.onZoomDeactivated)()
                }
                return
            }

            zoom.value = withTiming(doubleTabZoom, TIMING_CONFIG)
            savedZoom.value = withTiming(doubleTabZoom, TIMING_CONFIG)

            const boundaries = getBoundaries(doubleTabZoom)
            if (imageWidth * doubleTabZoom > windowWidth) {
                const { x } = event
                const halfWindowWidth = windowWidth / 2
                const distanceFromCenterX = halfWindowWidth - x

                let displacementDistanceX = (distanceFromCenterX * doubleTabZoom) - distanceFromCenterX
                displacementDistanceX = clamp(displacementDistanceX, -boundaries.x, boundaries.x)
                translateX.value = withTiming(displacementDistanceX, TIMING_CONFIG)
            }
            if (imageHeight * doubleTabZoom > windowHeight) {
                const { y } = event
                const halfWindowHeight = windowHeight / 2
                const distanceFromCenterY = halfWindowHeight - y

                let displacementDistanceY = (distanceFromCenterY * doubleTabZoom) - distanceFromCenterY
                displacementDistanceY = clamp(displacementDistanceY, -boundaries.y, boundaries.y)
                translateY.value = withTiming(displacementDistanceY, TIMING_CONFIG)
            }

            runOnJS(setIsPanGestureEnabled)(true)
            if (props.onZoomActivated) {
                runOnJS(props.onZoomActivated)()
            }
        })

    const panGesture = Gesture.Pan()
        .enabled(isPanGestureEnabled)
        .onBegin(event => {
            cancelAnimation(translateX)
            cancelAnimation(translateY)
        })
        .onStart(event => {
            initialTranslationX.value = translateX.value
            initialTranslationY.value = translateY.value
        })
        .onChange(event => {
            const boundaries = getBoundaries(zoom.value)

            if (imageWidth * zoom.value > windowWidth) {
                const newTranslateX = initialTranslationX.value + event.translationX
                translateX.value = clamp(newTranslateX, -boundaries.x, boundaries.x)
            } else {
                translateX.value = withTiming(0, TIMING_CONFIG)
            }

            if (imageHeight * zoom.value > windowHeight) {
                const newTranslateY = initialTranslationY.value + event.translationY
                translateY.value = clamp(newTranslateY, -boundaries.y, boundaries.y)
            } else {
                translateY.value = withTiming(0, TIMING_CONFIG)
            }
        })
        .onEnd((event, success) => {
            const boundaries = getBoundaries(zoom.value)

            if (Math.abs(event.velocityX) >= 200) {
                translateX.value = withDecay({
                    velocity: event.velocityX,
                    clamp: [-boundaries.x, boundaries.x],
                })
            }

            if (Math.abs(event.velocityY) >= 200) {
                translateY.value = withDecay({
                    velocity: event.velocityY,
                    clamp: [-boundaries.y, boundaries.y],
                })
            }
        })


    const tapComposedGestures = Gesture.Exclusive(doubleTapGesture, singleTapGesture)
    const raceComposedGestures = Gesture.Race(pinchGesture, tapComposedGestures)
    const simultaneousComposedGestures = Gesture.Simultaneous(raceComposedGestures, panGesture)


    const imageStyle = useAnimatedStyle(() => ({
        flex: 1,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: zoom.value },
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

            setImageWidth(newImageWidth)
            setImageHeight(newImageHeight)
        }

        if (props.source.uri && windowWidth !== 0 && windowHeight !== 0) {
            Image.getSize(props.source.uri, onSuccess, props.onError)
        }
    }, [windowWidth, windowHeight])


    return (
        <GestureDetector gesture={simultaneousComposedGestures}>
            <View style={[ { flex: 1, width, overflow: "hidden" }, props.style]}>
                <AnimatedFastImage
                    source={props.source}
                    resizeMode={"contain"}
                    style={imageStyle}
                    onError={props.onError}
                    onLayout={event => {
                        setWindowWidth(event.nativeEvent.layout.width)
                        setWindowHeight(event.nativeEvent.layout.height)
                    }}
                />
            </View>
        </GestureDetector>
    )
}
