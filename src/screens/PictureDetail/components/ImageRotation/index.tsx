import type { FastImageProps } from '@d11/react-native-fast-image'
import FastImage from '@d11/react-native-fast-image'
import type { ComponentClass } from 'react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react'
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import { StyleSheet, View } from 'react-native'
import {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useImageSize, useImageViewSize } from '../../hooks'
import { LoadingOverlay } from './components'


const AnimatedFastImage = createAnimatedComponent(
  FastImage as ComponentClass<FastImageProps>,
)

const PERPENDICULAR_ANGLES = [0, 90, 180, 270, 360]


interface ImageRotationProps {
  isVisible: boolean
  currentPicturePath: string
  isSavingRotatedPicture: boolean
  style?: StyleProp<ViewStyle>
  onError?: (error?: unknown) => void
}


export interface ImageRotationRef {
  getRotationDegree: () => number
  rotateLeft: () => void
  rotateRight: () => void
}


// TODO: Show warning on error loading the image
export const ImageRotation = forwardRef<ImageRotationRef, ImageRotationProps>((
  props,
  ref,
) => {
  const {
    isVisible,
    currentPicturePath,
    isSavingRotatedPicture,
    style,
    onError,
  } = props


  const { imageViewSize, setImageViewSize } = useImageViewSize()
  const { imageSize } = useImageSize({
    imageAbsolutePathOrUri: currentPicturePath,
    imageViewSize,
  })

  const degree = useSharedValue(0)
  const scale = useSharedValue(1)

  const overlayLeft = useSharedValue(0)
  const overlayTop = useSharedValue(0)
  const overlayWidth = useSharedValue(0)
  const overlayHeight = useSharedValue(0)


  useImperativeHandle(ref, () => ({
    getRotationDegree: getRotationDegree,
    rotateLeft: () => rotate(-90),
    rotateRight: () => rotate(90),
  }))


  function getRotationDegree() {
    return degree.value
  }

  function rotate(degreeToRotate: number) {
    const newDegree = degree.value + degreeToRotate
    let newScale = 1
    let newImageWidth = imageSize.width
    let newImageHeight = imageSize.height

    const newDegreeAbsoluteValue = Math.abs(newDegree)
    if (!PERPENDICULAR_ANGLES.includes(newDegreeAbsoluteValue)) {
      return
    }

    if (scale.value === 1) {
      const rotatedImageWidth = imageSize.height
      const rotatedImageHeight = imageSize.width

      newScale = imageViewSize.width / rotatedImageWidth
      newImageWidth = rotatedImageWidth * newScale
      newImageHeight = rotatedImageHeight * newScale
      if (newImageHeight > imageViewSize.height) {
        newScale = imageViewSize.height / rotatedImageHeight
        newImageWidth = rotatedImageWidth * newScale
        newImageHeight = rotatedImageHeight * newScale
      }
    }

    overlayLeft.value = (imageViewSize.width - newImageWidth) / 2
    overlayTop.value = (imageViewSize.height - newImageHeight) / 2
    overlayWidth.value = newImageWidth
    overlayHeight.value = newImageHeight

    degree.value = withTiming(newDegree, { duration: 150 })
    scale.value = withTiming(newScale, { duration: 150 })
  }


  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setImageViewSize({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    })
  }, [])


  useEffect(() => {
    if (!isVisible) return

    degree.value = 0
    scale.value = 1
    overlayLeft.value = 0
    overlayTop.value = 0
    overlayWidth.value = 0
    overlayHeight.value = 0
  }, [isVisible])


  const imageWrapperStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return StyleSheet.flatten([
      { overflow: 'hidden' },
      style,
    ])
  }, [style])

  const imageStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      { rotate: `${degree.value}deg` },
      { scale: scale.value },
    ],
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    left: overlayLeft.value,
    top: overlayTop.value,
    width: overlayWidth.value,
    height: overlayHeight.value,
    opacity: isSavingRotatedPicture ? 1 : 0,
  }))


  if (!isVisible) return null


  return (
    <View style={imageWrapperStyle}>
      <AnimatedFastImage
        source={{ uri: currentPicturePath }}
        resizeMode={'contain'}
        onLayout={onLayout}
        style={imageStyle}
      />

      <LoadingOverlay style={overlayStyle} />
    </View>
  )
})
