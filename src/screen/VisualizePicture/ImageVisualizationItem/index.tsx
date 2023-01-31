import { ComponentClass, useEffect, useMemo, useState } from "react"
import { Image, useWindowDimensions, View } from "react-native"
import FastImage, { FastImageProps, Source } from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Reanimated, {
    cancelAnimation,
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDecay,
    withTiming
} from "react-native-reanimated"


const AnimatedFastImage = Reanimated.createAnimatedComponent(FastImage as ComponentClass<FastImageProps>)


const ANIMATION_DURATION = 150


function clamp(value: number, lowerBound: number, upperBound: number): number {
    "worklet"
    return Math.max(lowerBound, Math.min(value, upperBound))
}


export interface ImageVisualizationItemProps {
    source: Source;
    minZoom?: number;
    maxZoom?: number;
    doubleTabZoom?: number;
    zoomMargin?: number;
    allowZoomOut?: boolean;
    onZoomActivated?: () => void;
    onZoomDeactivated?: () => void;
    onError?: (error?: unknown) => void;
}


// TODO implement focal when zooming
// TODO add style prop
// TODO handle scaled image overflow in its parent component
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


    const boudaries = useDerivedValue(() => {
        const margin = (zoom.value === 0) ? 0 : (zoomMargin / zoom.value)
        const limitX = (imageWidth * zoom.value - windowWidth) / (2 * zoom.value)
        const limitY = (imageHeight * zoom.value - windowHeight) / (2 * zoom.value)
        return {
            x: limitX + margin,
            y: limitY + margin,
        }
    }, [zoomMargin, zoom.value, imageWidth, imageHeight, windowWidth, windowHeight])


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

            zoom.value = withTiming(doubleTabZoom, { duration: ANIMATION_DURATION })
            savedZoom.value = withTiming(doubleTabZoom, { duration: ANIMATION_DURATION })

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
            if (imageWidth * zoom.value > windowWidth) {
                const newTranslateX = initialTranslationX.value + (event.translationX / zoom.value)
                translateX.value = clamp(newTranslateX, -boudaries.value.x, boudaries.value.x)
            } else {
                translateX.value = withTiming(0, { duration: ANIMATION_DURATION })
            }

            if (imageHeight * zoom.value > windowHeight) {
                const newTranslateY = initialTranslationY.value + (event.translationY / zoom.value)
                translateY.value = clamp(newTranslateY, -boudaries.value.y, boudaries.value.y)
            } else {
                translateY.value = withTiming(0, { duration: ANIMATION_DURATION })
            }
        })
        .onEnd((event, success) => {
            if (Math.abs(event.velocityX) >= 200) {
                translateX.value = withDecay({
                    velocity: event.velocityX / zoom.value,
                    clamp: [-boudaries.value.x, boudaries.value.x],
                })
            }

            if (Math.abs(event.velocityY) >= 200) {
                translateY.value = withDecay({
                    velocity: event.velocityY / zoom.value,
                    clamp: [-boudaries.value.y, boudaries.value.y],
                })
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
            <View style={{ flex: 1, width }}>
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
