import { useEffect, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CAMERA_HEADER_HEIGHT } from '../components'
import { useCameraViewSize } from './useCameraViewSize.ts'


interface CameraViewMarginParams {
  isShowingCamera: boolean
}


interface CameraViewMargin {
  top: number
}


const INITIAL_CAMERA_VIEW_MARGIN: CameraViewMargin = {
  top: 0,
}


export function useCameraViewMargin(
  params: CameraViewMarginParams,
): CameraViewMargin {
  const { isShowingCamera } = params


  const safeAreaInsets = useSafeAreaInsets()
  const windowSize = useWindowDimensions()

  const cameraViewSize = useCameraViewSize()

  const [cameraViewMargin, setCameraViewMargin] = useState<CameraViewMargin>(
    INITIAL_CAMERA_VIEW_MARGIN,
  )


  const margin = useMemo(() => {
    if (!isShowingCamera) {
      return {
        top: 0,
      }
    }

    const cameraViewHeightWithMargin = (
      safeAreaInsets.top
      + CAMERA_HEADER_HEIGHT
      + cameraViewSize.height
    )

    if (cameraViewHeightWithMargin < windowSize.height) {
      return {
        top: CAMERA_HEADER_HEIGHT,
      }
    }

    return {
      top: 0,
    }
  }, [isShowingCamera, safeAreaInsets, cameraViewSize, windowSize])


  useEffect(() => {
    setCameraViewMargin(margin)
  }, [margin])


  return cameraViewMargin
}
