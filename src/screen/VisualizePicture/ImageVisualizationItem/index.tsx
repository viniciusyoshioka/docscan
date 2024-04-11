import { ComponentClass, useEffect, useState } from "react"
import { Image, StyleProp, View, ViewStyle, useWindowDimensions } from "react-native"
import FastImage, { FastImageProps, Source } from "react-native-fast-image"
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler"
import Reanimated, {
  cancelAnimation,
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from "react-native-reanimated"

import { TIMING_CONFIG } from "./animation-config"


const AnimatedFastImage = Reanimated.createAnimatedComponent(
  FastImage as ComponentClass<FastImageProps>
)


export interface ImageVisualizationItemProps {
  source: Source
  onError?: (error?: unknown) => void
  style?: StyleProp<ViewStyle>

  minZoom?: number
  maxZoom?: number
  doubleTabZoom?: number
  zoomMargin?: number
  allowZoomOut?: boolean

  onZoomActivated?: () => void
  onZoomDeactivated?: () => void
  onSingleTap?: (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => void
}


export function ImageVisualizationItem(props: ImageVisualizationItemProps) {


  const minZoom = props.minZoom ?? 0.9
  const maxZoom = props.maxZoom ?? 10
  const doubleTabZoom = props.doubleTabZoom ?? 2
  const zoomMargin = props.zoomMargin ?? 0
  const allowZoomOut = props.allowZoomOut ?? false

  const { width } = useWindowDimensions()

  const [windowWidth, setWindowWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [imageWidth, setImageWidth] = useState(0)
  const [imageHeight, setImageHeight] = useState(0)
  const [isPanGestureEnabled, setIsPanGestureEnabled] = useState(false)

  const zoom = useSharedValue(1)
  const savedZoom = useSharedValue(1)
  const initialFocalX = useSharedValue(0)
  const initialFocalY = useSharedValue(0)
  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)
  const initialTranslateX = useSharedValue(0)
  const initialTranslateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)


  function getBoundaries(newZoom: number) {
    "worklet"
    const margin = (newZoom === 0) ? 0 : zoomMargin
    const limitX = ((imageWidth * newZoom) - windowWidth) / 2
    const limitY = ((imageHeight * newZoom) - windowHeight) / 2
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

      initialFocalX.value = event.focalX
      initialFocalY.value = event.focalY
      focalX.value = event.focalX
      focalY.value = event.focalY
      initialTranslateX.value = translateX.value
      initialTranslateY.value = translateY.value

      if (props.onZoomActivated) {
        runOnJS(props.onZoomActivated)()
      }
    })
    .onChange(event => {
      if (event.numberOfPointers !== 2) {
        return
      }

      zoom.value = savedZoom.value * event.scale
      zoom.value = clamp(zoom.value, minZoom, maxZoom)

      focalX.value = event.focalX
      focalY.value = event.focalY

      const diffScale = zoom.value / savedZoom.value
      const boundaries = getBoundaries(zoom.value)
      if (imageWidth * zoom.value > windowWidth) {
        const previousWindowWidth = windowWidth * savedZoom.value
        const previousWidthOffScreen = (
          ((previousWindowWidth - windowWidth) / 2) - initialTranslateX.value
        )
        const previousFocalX = previousWidthOffScreen + initialFocalX.value
        const previousHalfWindowWidth = previousWindowWidth / 2

        const distanceFromPreviousCenterX = previousHalfWindowWidth - previousFocalX
        const distanceFromCurrentCenterX = distanceFromPreviousCenterX * diffScale

        const displacementX = (
          (
            distanceFromCurrentCenterX
            - distanceFromPreviousCenterX
            + initialTranslateX.value
          )
          + (focalX.value - initialFocalX.value)
        )

        translateX.value = clamp(displacementX, -boundaries.x, boundaries.x)
      }
      if (imageHeight * zoom.value > windowHeight) {
        const previousWindowHeight = windowHeight * savedZoom.value
        const previousHeightOffScreen = (
          ((previousWindowHeight - windowHeight) / 2) - initialTranslateY.value
        )
        const previousFocalY = previousHeightOffScreen + initialFocalY.value
        const previousHalfWindowHeight = previousWindowHeight / 2

        const distanceFromPreviousCenterY = previousHalfWindowHeight - previousFocalY
        const distanceFromCurrentCenterY = distanceFromPreviousCenterY * diffScale

        const displacementY = (
          (
            distanceFromCurrentCenterY
            - distanceFromPreviousCenterY
            + initialTranslateY.value
          )
          + (focalY.value - initialFocalY.value)
        )

        translateY.value = clamp(displacementY, -boundaries.y, boundaries.y)
      }
    })
    .onEnd((event, success) => {
      if (event.numberOfPointers !== 2) {
        return
      }

      if (!allowZoomOut && zoom.value < 1) {
        zoom.value = withTiming(1, TIMING_CONFIG)
        savedZoom.value = withTiming(1, TIMING_CONFIG)

        initialFocalX.value = 0
        initialFocalY.value = 0
        focalX.value = 0
        focalY.value = 0
        initialTranslateX.value = 0
        initialTranslateY.value = 0
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
        initialFocalX.value = 0
        initialFocalY.value = 0
        focalX.value = 0
        focalY.value = 0
        initialTranslateX.value = withTiming(0, TIMING_CONFIG)
        initialTranslateY.value = withTiming(0, TIMING_CONFIG)
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

      initialFocalX.value = event.x
      initialFocalY.value = event.y
      focalX.value = event.x
      focalY.value = event.y

      const boundaries = getBoundaries(doubleTabZoom)
      if (imageWidth * doubleTabZoom > windowWidth) {
        const { x } = event
        const halfWindowWidth = windowWidth / 2
        const distanceFromCenterX = halfWindowWidth - x

        let displacementDistanceX = (
          (distanceFromCenterX * doubleTabZoom) - distanceFromCenterX
        )
        displacementDistanceX = clamp(displacementDistanceX, -boundaries.x, boundaries.x)
        translateX.value = withTiming(displacementDistanceX, TIMING_CONFIG)
      }
      if (imageHeight * doubleTabZoom > windowHeight) {
        const { y } = event
        const halfWindowHeight = windowHeight / 2
        const distanceFromCenterY = halfWindowHeight - y

        let displacementDistanceY = (
          (distanceFromCenterY * doubleTabZoom) - distanceFromCenterY
        )
        displacementDistanceY = clamp(displacementDistanceY, -boundaries.y, boundaries.y)
        translateY.value = withTiming(displacementDistanceY, TIMING_CONFIG)
      }

      runOnJS(setIsPanGestureEnabled)(true)
      if (props.onZoomActivated) {
        runOnJS(props.onZoomActivated)()
      }
    })

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .enabled(isPanGestureEnabled)
    .onBegin(event => {
      cancelAnimation(translateX)
      cancelAnimation(translateY)
    })
    .onStart(event => {
      initialTranslateX.value = translateX.value
      initialTranslateY.value = translateY.value
    })
    .onChange(event => {
      const boundaries = getBoundaries(zoom.value)

      if (imageWidth * zoom.value > windowWidth) {
        const newTranslateX = initialTranslateX.value + event.translationX
        translateX.value = clamp(newTranslateX, -boundaries.x, boundaries.x)
      } else {
        translateX.value = withTiming(0, TIMING_CONFIG)
      }

      if (imageHeight * zoom.value > windowHeight) {
        const newTranslateY = initialTranslateY.value + event.translationY
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
  const simultaneousGestures = Gesture.Simultaneous(raceComposedGestures, panGesture)


  const imageStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: zoom.value },
    ],
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
    <GestureDetector gesture={simultaneousGestures}>
      <View style={[{ flex: 1, width, overflow: "hidden" }, props.style]}>
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
