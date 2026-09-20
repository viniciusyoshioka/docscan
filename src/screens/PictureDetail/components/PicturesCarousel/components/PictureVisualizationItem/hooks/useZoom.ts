import { clamp, withSpring, withTiming } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import type { ImageSize, ImageViewSize } from '../../../../../hooks'
import { LINEAR_TIMING_CONFIG } from '../picture-visualization-item.constants.ts'
import { useGetBoundaries } from './useGetBoundaries.ts'
import type { ImageTransformData } from './useImageTransformData.ts'


interface ZoomParams {
  doubleTabZoom: number
  minZoom: number
  maxZoom: number
  zoomMargin: number
  allowZoomOut: boolean
  imageSize: ImageSize
  imageViewSize: ImageViewSize
  imageTransform: ImageTransformData
  onZoomActivated?: () => void
  onZoomDeactivated?: () => void
  enablePanGesture: () => void
  disablePanGesture: () => void
  scrollToItem?: () => void
}


interface ApplyDoubleTapZoomParams {
  x: number
  y: number
}

interface ActivatePinchZoomParams {
  focalX: number
  focalY: number
}

interface ApplyPinchZoomParams {
  focalX: number
  focalY: number
  scale: number
}

interface UseZoom {
  applyDoubleTapZoom: (params: ApplyDoubleTapZoomParams) => void
  activatePinchZoom: (params: ActivatePinchZoomParams) => void
  applyPinchZoom: (params: ApplyPinchZoomParams) => void
  deactivatePinchZoom: () => void
}


export function useZoom(params: ZoomParams): UseZoom {
  const {
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
  } = params


  const getBoundaries = useGetBoundaries({
    zoomMargin,
    imageSize,
    imageViewSize,
  })


  function addDoubleTapZoom(x: number, y: number) {
    imageTransform.zoom.value = withSpring(
      doubleTabZoom,
      LINEAR_TIMING_CONFIG,
    )
    imageTransform.savedZoom.value = withSpring(
      doubleTabZoom,
      LINEAR_TIMING_CONFIG,
    )

    imageTransform.initialFocalX.value = x
    imageTransform.initialFocalY.value = y
    imageTransform.focalX.value = x
    imageTransform.focalY.value = y

    const boundaries = getBoundaries(doubleTabZoom)

    if (imageSize.width * doubleTabZoom > imageViewSize.width) {
      const halfImageViewWidth = imageViewSize.width / 2
      const distanceFromCenterX = halfImageViewWidth - x

      const displacementDistanceX = clamp(
        (distanceFromCenterX * doubleTabZoom) - distanceFromCenterX,
        -boundaries.x,
        boundaries.x,
      )

      imageTransform.translateX.value = withSpring(
        displacementDistanceX,
        LINEAR_TIMING_CONFIG,
      )
    }

    if (imageSize.height * doubleTabZoom > imageViewSize.height) {
      const halfImageViewHeight = imageViewSize.height / 2
      const distanceFromCenterY = halfImageViewHeight - y

      const displacementDistanceY = clamp(
        (distanceFromCenterY * doubleTabZoom) - distanceFromCenterY,
        -boundaries.y,
        boundaries.y,
      )

      imageTransform.translateY.value = withSpring(
        displacementDistanceY,
        LINEAR_TIMING_CONFIG,
      )
    }

    if (onZoomActivated) {
      onZoomActivated()
    }
    enablePanGesture()
  }

  function removeDoubleTapZoom() {
    imageTransform.zoom.value = withSpring(
      1,
      LINEAR_TIMING_CONFIG,
    )
    imageTransform.savedZoom.value = withSpring(
      1,
      LINEAR_TIMING_CONFIG,
    )

    imageTransform.initialFocalX.value = 0
    imageTransform.initialFocalY.value = 0
    imageTransform.focalX.value = 0
    imageTransform.focalY.value = 0

    imageTransform.initialTranslateX.value = withSpring(
      0,
      LINEAR_TIMING_CONFIG,
    )
    imageTransform.initialTranslateY.value = withSpring(
      0,
      LINEAR_TIMING_CONFIG,
    )
    imageTransform.translateX.value = withSpring(
      0,
      LINEAR_TIMING_CONFIG,
    )
    imageTransform.translateY.value = withSpring(
      0,
      LINEAR_TIMING_CONFIG,
    )

    disablePanGesture()
    if (onZoomDeactivated) {
      onZoomDeactivated()
    }
  }

  function applyDoubleTapZoom(params: ApplyDoubleTapZoomParams) {
    const { x, y } = params

    if (imageTransform.zoom.value === 1) {
      addDoubleTapZoom(x, y)
    } else {
      removeDoubleTapZoom()
    }
  }


  function activatePinchZoom(params: ActivatePinchZoomParams) {
    'worklet'

    imageTransform.initialFocalX.value = params.focalX
    imageTransform.initialFocalY.value = params.focalY
    imageTransform.focalX.value = params.focalX
    imageTransform.focalY.value = params.focalY
    imageTransform.initialTranslateX.value = imageTransform.translateX.value
    imageTransform.initialTranslateY.value = imageTransform.translateY.value

    if (onZoomActivated) {
      scheduleOnRN(onZoomActivated)
    }
    if (scrollToItem) {
      scheduleOnRN(scrollToItem)
    }
    scheduleOnRN(enablePanGesture)
  }

  function applyPinchZoom(params: ApplyPinchZoomParams) {
    'worklet'

    imageTransform.zoom.value = clamp(
      imageTransform.savedZoom.value * params.scale,
      minZoom,
      maxZoom,
    )

    imageTransform.focalX.value = params.focalX
    imageTransform.focalY.value = params.focalY

    const boundaries = getBoundaries(imageTransform.zoom.value)
    const diffScale = (
      imageTransform.zoom.value / imageTransform.savedZoom.value
    )

    if (imageSize.width * imageTransform.zoom.value > imageViewSize.width) {
      const previousImageViewWidth = (
        imageViewSize.width * imageTransform.savedZoom.value
      )
      const previousImageViewWidthOffScreen = (
        (previousImageViewWidth - imageViewSize.width) / 2
      )
      const previousDisplacedImageViewWidthOffScreen = (
        previousImageViewWidthOffScreen
        - imageTransform.initialTranslateX.value
      )
      const previousFocalX = (
        previousDisplacedImageViewWidthOffScreen
        + imageTransform.initialFocalX.value
      )
      const previousHalfImageViewWidth = (
        previousImageViewWidth / 2
      )

      const distanceFromPreviousCenterX =
        previousHalfImageViewWidth - previousFocalX
      const distanceFromCurrentCenterX =
        distanceFromPreviousCenterX * diffScale

      const displacementX = (
        (
          distanceFromCurrentCenterX
          - distanceFromPreviousCenterX
          + imageTransform.initialTranslateX.value
        )
        + (
          imageTransform.focalX.value
          - imageTransform.initialFocalX.value
        )
      )

      imageTransform.translateX.value = clamp(
        displacementX,
        -boundaries.x,
        boundaries.x,
      )
    }

    if (imageSize.height * imageTransform.zoom.value > imageViewSize.height) {
      const previousImageViewHeight = (
        imageViewSize.height * imageTransform.savedZoom.value
      )
      const previousImageViewHeightOffScreen = (
        (previousImageViewHeight - imageViewSize.height) / 2
      )
      const previousDisplacedImageViewHeightOffScreen = (
        previousImageViewHeightOffScreen
        - imageTransform.initialTranslateY.value
      )
      const previousFocalY = (
        previousDisplacedImageViewHeightOffScreen
        + imageTransform.initialFocalY.value
      )
      const previousHalfImageViewHeight = (
        previousImageViewHeight / 2
      )

      const distanceFromPreviousCenterY =
        previousHalfImageViewHeight - previousFocalY
      const distanceFromCurrentCenterY =
        distanceFromPreviousCenterY * diffScale

      const displacementY = (
        (
          distanceFromCurrentCenterY
          - distanceFromPreviousCenterY
          + imageTransform.initialTranslateY.value
        )
        + (
          imageTransform.focalY.value
          - imageTransform.initialFocalY.value
        )
      )

      imageTransform.translateY.value = clamp(
        displacementY,
        -boundaries.y,
        boundaries.y,
      )
    }
  }

  function restorePinchZoomOut() {
    'worklet'

    imageTransform.zoom.value = withTiming(1, LINEAR_TIMING_CONFIG)
    imageTransform.savedZoom.value = withTiming(1, LINEAR_TIMING_CONFIG)

    imageTransform.initialFocalX.value = 0
    imageTransform.initialFocalY.value = 0
    imageTransform.focalX.value = 0
    imageTransform.focalY.value = 0

    imageTransform.initialTranslateX.value = 0
    imageTransform.initialTranslateY.value = 0
    imageTransform.translateX.value = 0
    imageTransform.translateY.value = 0

    scheduleOnRN(disablePanGesture)
    if (onZoomDeactivated) {
      scheduleOnRN(onZoomDeactivated)
    }
  }

  function persistAppliedPinchZoom() {
    'worklet'

    imageTransform.savedZoom.value = imageTransform.zoom.value
    scheduleOnRN(enablePanGesture)
  }

  function deactivatePinchZoom() {
    'worklet'

    const hasZoomOut = imageTransform.zoom.value < 1
    const shouldRestoreZoomOut = !allowZoomOut && hasZoomOut

    if (shouldRestoreZoomOut) {
      restorePinchZoomOut()
    } else {
      persistAppliedPinchZoom()
    }
  }


  return {
    applyDoubleTapZoom,
    activatePinchZoom,
    applyPinchZoom,
    deactivatePinchZoom,
  }
}
