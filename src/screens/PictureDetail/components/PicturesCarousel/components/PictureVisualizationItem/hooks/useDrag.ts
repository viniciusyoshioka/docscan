import { cancelAnimation, clamp, withDecay, withTiming } from 'react-native-reanimated'

import type { ImageSize, ImageViewSize } from '../../../../../hooks'
import { LINEAR_TIMING_CONFIG } from '../picture-visualization-item.constants.ts'
import { useGetBoundaries } from './useGetBoundaries.ts'
import type { ImageTransformData } from './useImageTransformData.ts'


interface DragParams {
  zoomMargin: number
  imageSize: ImageSize
  imageViewSize: ImageViewSize
  imageTransform: ImageTransformData
}


interface ApplyDragParams {
  translationX: number
  translationY: number
}

interface DeactivateDragParams {
  velocityX: number
  velocityY: number
}

interface UseDrag {
  beforeActivateDrag: () => void
  activateDrag: () => void
  applyDrag: (params: ApplyDragParams) => void
  deactivateDrag: (params: DeactivateDragParams) => void
}


export function useDrag(params: DragParams): UseDrag {
  const {
    zoomMargin,
    imageSize,
    imageViewSize,
    imageTransform,
  } = params


  const getBoundaries = useGetBoundaries({
    zoomMargin,
    imageSize,
    imageViewSize,
  })


  function beforeActivateDrag() {
    'worklet'

    cancelAnimation(imageTransform.translateX)
    cancelAnimation(imageTransform.translateY)
  }


  function activateDrag() {
    'worklet'

    imageTransform.initialTranslateX.value = imageTransform.translateX.value
    imageTransform.initialTranslateY.value = imageTransform.translateY.value
  }


  function applyDrag(params: ApplyDragParams) {
    'worklet'

    const boundaries = getBoundaries(imageTransform.zoom.value)

    const hasWidthOverflow = (
      imageSize.width * imageTransform.zoom.value > imageViewSize.width
    )
    const hasHeightOverflow = (
      imageSize.height * imageTransform.zoom.value > imageViewSize.height
    )

    if (hasWidthOverflow) {
      imageTransform.translateX.value = clamp(
        imageTransform.initialTranslateX.value + params.translationX,
        -boundaries.x,
        boundaries.x,
      )
    } else {
      imageTransform.translateX.value = withTiming(0, LINEAR_TIMING_CONFIG)
    }

    if (hasHeightOverflow) {
      imageTransform.translateY.value = clamp(
        imageTransform.initialTranslateY.value + params.translationY,
        -boundaries.y,
        boundaries.y,
      )
    } else {
      imageTransform.translateY.value = withTiming(0, LINEAR_TIMING_CONFIG)
    }
  }


  function deactivateDrag(params: DeactivateDragParams) {
    'worklet'

    const boundaries = getBoundaries(imageTransform.zoom.value)

    if (Math.abs(params.velocityX) >= 200) {
      const hasWidthOverflow = (
        imageSize.width * imageTransform.zoom.value > imageViewSize.width
      )

      const minClamp = hasWidthOverflow ? -boundaries.x : 0
      const maxClamp = hasWidthOverflow ? boundaries.x : 0

      imageTransform.translateX.value = withDecay({
        velocity: params.velocityX,
        clamp: [minClamp, maxClamp],
      })
    }

    if (Math.abs(params.velocityY) >= 200) {
      const hasHeightOverflow = (
        imageSize.height * imageTransform.zoom.value > imageViewSize.height
      )

      const minClamp = hasHeightOverflow ? -boundaries.y : 0
      const maxClamp = hasHeightOverflow ? boundaries.y : 0

      imageTransform.translateY.value = withDecay({
        velocity: params.velocityY,
        clamp: [minClamp, maxClamp],
      })
    }
  }


  return {
    beforeActivateDrag,
    activateDrag,
    applyDrag,
    deactivateDrag,
  }
}
