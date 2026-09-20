import type { FastImageProps } from '@d11/react-native-fast-image'
import FastImage from '@d11/react-native-fast-image'
import type { ComponentClass } from 'react'
import { useCallback, useMemo } from 'react'
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import { createAnimatedComponent, useAnimatedStyle } from 'react-native-reanimated'

import type { PictureEntity } from '@database'
import { AbsolutePath, PathUtils } from '@modules/file-system'
import { Info } from '@modules/info'
import { useImageSize, useImageViewSize } from '../../../../hooks'
import {
  useComposedGestures,
  useDoubleTapGesture,
  useDrag,
  useImageTransformData,
  usePanGesture,
  usePinchGesture,
  useSingleTapGesture,
  useZoom,
} from './hooks'


const AnimatedFastImage = createAnimatedComponent(
  FastImage as ComponentClass<FastImageProps>,
)


interface PictureVisualizationItemProps {
  item: PictureEntity

  minZoom?: number
  maxZoom?: number
  doubleTabZoom?: number
  zoomMargin?: number
  allowZoomOut?: boolean

  onZoomActivated?: () => void
  onZoomDeactivated?: () => void
  onSingleTap?: () => void

  scrollToItem?: () => void

  onError?: (error?: unknown) => void
  style?: StyleProp<ViewStyle>
}


// TODO: Show a warning when there is an error showing the picture
export function PictureVisualizationItem(props: PictureVisualizationItemProps) {
  const {
    item,

    minZoom = 0.9,
    maxZoom = 10,
    doubleTabZoom = 2,
    zoomMargin = 0,
    allowZoomOut = false,

    onZoomActivated,
    onZoomDeactivated,
    onSingleTap,

    scrollToItem,

    onError,
    style,
  } = props


  const { width } = useWindowDimensions()


  const pictureImagePath = useMemo(() => {
    const picturePath = new AbsolutePath([
      Info.folders.internal.pictures,
      item.fileName,
    ])

    return PathUtils.withFileProtocol(picturePath.absolutePath)
  }, [item])

  const { imageViewSize, setImageViewSize } = useImageViewSize()

  const { imageSize } = useImageSize({
    imageAbsolutePathOrUri: pictureImagePath,
    imageViewSize: imageViewSize,
  })

  const imageTransform = useImageTransformData()


  const { singleTapGesture } = useSingleTapGesture({
    onSingleTap: () => {
      if (onSingleTap) {
        onSingleTap()
      }
    },
  })


  const {
    beforeActivateDrag,
    activateDrag,
    applyDrag,
    deactivateDrag,
  } = useDrag({
    zoomMargin,
    imageSize,
    imageViewSize,
    imageTransform,
  })

  const { panGesture, enablePanGesture, disablePanGesture } = usePanGesture({
    onBegin: event => {
      'worklet'

      beforeActivateDrag()
    },
    onActivate: event => {
      'worklet'

      activateDrag()
    },
    onUpdate: event => {
      'worklet'

      applyDrag({
        translationX: event.translationX,
        translationY: event.translationY,
      })
    },
    onDeactivate: event => {
      'worklet'

      deactivateDrag({
        velocityX: event.velocityX,
        velocityY: event.velocityY,
      })
    },
  })


  const {
    applyDoubleTapZoom,
    activatePinchZoom,
    applyPinchZoom,
    deactivatePinchZoom,
  } = useZoom({
    doubleTabZoom,
    minZoom,
    maxZoom,
    zoomMargin,
    allowZoomOut,
    imageSize,
    imageViewSize,
    imageTransform,
    onZoomActivated,
    onZoomDeactivated,
    enablePanGesture,
    disablePanGesture,
    scrollToItem,
  })

  const { doubleTapGesture } = useDoubleTapGesture({
    onDoubleTap: ({ x, y }) => {
      applyDoubleTapZoom({ x, y })
    },
  })

  const { pinchGesture } = usePinchGesture({
    onActivate: event => {
      'worklet'

      activatePinchZoom({
        focalX: event.focalX,
        focalY: event.focalY,
      })
    },
    onUpdate: event => {
      'worklet'

      applyPinchZoom({
        focalX: event.focalX,
        focalY: event.focalY,
        scale: event.scale,
      })
    },
    onDeactivate: event => {
      'worklet'

      deactivatePinchZoom()
    },
  })


  const composedGestures = useComposedGestures({
    singleTapGesture,
    doubleTapGesture,
    pinchGesture,
    panGesture,
  })


  const onFastImageLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setImageViewSize({ width, height })
  }, [setImageViewSize])


  const imageWrapperStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return StyleSheet.flatten([
      {
        width,
        overflow: 'hidden',
      },
      style,
    ])
  }, [width, style])

  const imageStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      { translateX: imageTransform.translateX.value },
      { translateY: imageTransform.translateY.value },
      { scale: imageTransform.zoom.value },
    ],
  }))


  return (
    <GestureDetector gesture={composedGestures}>
      <View style={imageWrapperStyle}>
        <AnimatedFastImage
          source={{ uri: pictureImagePath }}
          resizeMode={'contain'}
          style={imageStyle}
          onError={onError}
          onLayout={onFastImageLayout}
        />
      </View>
    </GestureDetector>
  )
}
