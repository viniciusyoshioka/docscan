import React, { useEffect } from "react"
import { Image, ImageSourcePropType, StatusBar, useWindowDimensions } from "react-native"
import { HandlerStateChangeEvent, PanGestureHandler, PanGestureHandlerGestureEvent, PinchGestureHandler, PinchGestureHandlerEventPayload, PinchGestureHandlerGestureEvent, TapGestureHandler } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useSharedValue } from "react-native-reanimated"

import { HeaderHeight } from ".."
import { SafeScreen } from "../Screen"


export interface ImageVisualizationItemProps {
    source: ImageSourcePropType;
    minimumZoom?: number;
    maximumZoom?: number;
    doubleTapZoom?: number;
    allowZoomOut?: boolean;
    onZoomActivated?: () => void;
    onZoomDeactivated?: () => void;
    onError?: (message: string) => void;
}


export function ImageVisualizationItem(props: ImageVisualizationItemProps) {


    const STATUSBAR_HEIGHT = (StatusBar.currentHeight || 0)

    const { width, height } = useWindowDimensions()

    const baseScale = useSharedValue(1)
    const pinchScale = useSharedValue(1)
    const scale = useSharedValue(baseScale.value * pinchScale.value)
    let lastScale = 1

    const imageWidth = useSharedValue(0)
    const imageHeight = useSharedValue(0)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)


    function getZoomScale(scaleValue: number): number {
        "worklet"

        if (!props.allowZoomOut && scaleValue < 1) {
            return 1
        }

        if (props.minimumZoom && scaleValue < props.minimumZoom) {
            return props.minimumZoom
        } else if (scaleValue < 0.3) {
            return 0.3
        }

        if (props.maximumZoom && scaleValue > props.maximumZoom) {
            return props.maximumZoom
        } else if (scaleValue > 15) {
            return 15
        }

        return scaleValue
    }


    useAnimatedReaction(
        () => [baseScale.value, pinchScale.value],
        (newValue) => {
            const newScale = newValue[0] * newValue[1]
            scale.value = getZoomScale(newScale)
        }
    )

    useAnimatedReaction(
        () => scale.value,
        (scaleValue, previewsScaleValue) => {
            if (previewsScaleValue !== 1 && scaleValue === 1) {
                if (props.onZoomDeactivated) {
                    runOnJS(props.onZoomDeactivated)()
                }
            } else if (previewsScaleValue === 1 && scaleValue !== 1) {
                if (props.onZoomActivated) {
                    runOnJS(props.onZoomActivated)()
                }
            }
        }
    )


    const onPanGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { x: number, y: number }>({
        onStart: (_, context) => {
            if (scale.value !== 1) {
                context.x = translateX.value
                context.y = translateY.value
            }
        },
        onActive: ({ translationX, translationY }, context) => {
            let limitX = ((imageWidth.value * scale.value) - imageWidth.value + (2 * 16)) / (2 * scale.value)
            let limitY = (
                (imageHeight.value * scale.value) - height + (2 * 16) + HeaderHeight + STATUSBAR_HEIGHT
            ) / (2 * scale.value)

            if (((imageWidth.value * scale.value) + (2 * 16)) < width) {
                limitX *= -1
            }
            if (((imageHeight.value * scale.value) + (2 * 16)) > (height - HeaderHeight - STATUSBAR_HEIGHT)) {
                limitY *= -1
            }

            if (scale.value !== 1) {
                translateX.value = context.x + (translationX / scale.value)
                translateY.value = context.y + (translationY / scale.value)

                if (translateX.value < -limitX) {
                    translateX.value = -limitX
                } else if (translateX.value > limitX) {
                    translateX.value = limitX
                }

                if (translateY.value < limitY) {
                    translateY.value = limitY
                } else if (translateY.value > -limitY) {
                    translateY.value = -limitY
                }
            }
        },
    })


    function onTapGestureHandlerActivated(_: HandlerStateChangeEvent<Record<string, unknown>>) {
        if (scale.value === 1) {
            lastScale = props.doubleTapZoom || 3
            baseScale.value = props.doubleTapZoom || 3
            pinchScale.value = 1
            scale.value = props.doubleTapZoom || 3
        } else {
            lastScale = 1
            baseScale.value = 1
            pinchScale.value = 1
            scale.value = 1

            translateX.value = 0
            translateY.value = 0
        }
    }


    const onPinchGestureEvent = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
        onActive: (event) => {
            if (event.numberOfPointers === 2) {
                pinchScale.value = event.scale
            }
        },
    })

    function onPinchHandlerStateChange(event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) {
        if (event.nativeEvent.numberOfPointers === 2) {
            lastScale *= event.nativeEvent.scale
            baseScale.value = lastScale
            pinchScale.value = 1
        }
    }


    const imageStyle = useAnimatedStyle(() => {
        return {
            flex: 1,
            transform: [
                { scale: scale.value },
                { translateX: translateX.value },
                { translateY: translateY.value },
            ]
        }
    })


    useEffect(() => {
        function getImagePath() {
            if (typeof (props.source) === "string") {
                return props.source
            }
            return props.source.uri
        }

        function getImageSize(widthSize: number, heightSize: number) {
            const imageRatio = widthSize / heightSize
            imageWidth.value = width
            imageHeight.value = width / imageRatio
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function onGetImageSizeError(error: any) {
            if (props.onError) {
                props.onError(error)
            }
        }

        Image.getSize(getImagePath(), getImageSize, onGetImageSizeError)
    }, [])


    return (
        <SafeScreen style={{ width: useWindowDimensions().width }}>
            <PanGestureHandler
                enabled={scale.value !== 1}
                onGestureEvent={onPanGestureEvent}
            >
                <Animated.View style={{ flex: 1 }}>
                    <TapGestureHandler
                        numberOfTaps={2}
                        maxDist={30}
                        maxDelayMs={200}
                        onActivated={onTapGestureHandlerActivated}
                    >
                        <Animated.View style={{ flex: 1 }}>
                            <PinchGestureHandler
                                onGestureEvent={onPinchGestureEvent}
                                onHandlerStateChange={onPinchHandlerStateChange}
                            >
                                <Animated.View style={{ flex: 1 }}>
                                    <Animated.Image
                                        source={props.source}
                                        resizeMode={"contain"}
                                        style={imageStyle}
                                    />
                                </Animated.View>
                            </PinchGestureHandler>
                        </Animated.View>
                    </TapGestureHandler>
                </Animated.View>
            </PanGestureHandler>
        </SafeScreen>
    )
}
