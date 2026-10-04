import { useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import { Dimensions, StatusBar, useWindowDimensions } from 'react-native'

import { CameraRatio } from '@modules/settings'
import {
  ACTION_BUTTON_SIZE,
  CAMERA_HEADER_HEIGHT,
  CAPTURE_BUTTON_SIZE,
} from '../components'
import { useCameraViewSize } from './useCameraViewSize.ts'


const VERTICAL_PADDING_WITHOUT_CAMERA = 16
const VERTICAL_PADDING_WITH_CAMERA = 32


interface CameraControlStyleParams {
  isShowingCamera: boolean
}


interface CameraControlStyle {
  cameraControlStyle: ViewStyle
  cameraControlHeight: number
}


export function useCameraControlStyle(
  params: CameraControlStyleParams,
): CameraControlStyle {
  const { isShowingCamera } = params


  const windowDimensions = useWindowDimensions()
  const screenDimensions = Dimensions.get('screen')
  const statusBarHeight = StatusBar.currentHeight ?? 0


  const usableScreenWidth = screenDimensions.width
  const usableScreenHeight = screenDimensions.height - statusBarHeight
  const defaultCameraViewSize = useCameraViewSize({
    windowSize: {
      width: usableScreenWidth,
      height: usableScreenHeight,
    },
    cameraRatio: CameraRatio.RATIO_4_3,
  })


  const cameraControlHeightWithoutCamera = useMemo(() => {
    const paddingVertical = (2 * VERTICAL_PADDING_WITHOUT_CAMERA)

    const maxHeightBasedOnCaptureButton = CAPTURE_BUTTON_SIZE + paddingVertical
    const maxHeightBasedOnActionButton = ACTION_BUTTON_SIZE + paddingVertical

    return Math.max(maxHeightBasedOnCaptureButton, maxHeightBasedOnActionButton)
  }, [])

  // TODO: Add height limit for larger screens
  const cameraControlHeightWithCamera = useMemo(() => {
    const paddingVertical = (2 * VERTICAL_PADDING_WITH_CAMERA)

    const maxHeightBasedOnCaptureButton = CAPTURE_BUTTON_SIZE + paddingVertical
    const maxHeightBasedOnActionButton = ACTION_BUTTON_SIZE + paddingVertical
    const maxHeightBasedOnSpaceLeft = usableScreenHeight
      - CAMERA_HEADER_HEIGHT
      - defaultCameraViewSize.height

    return Math.max(
      maxHeightBasedOnCaptureButton,
      maxHeightBasedOnActionButton,
      maxHeightBasedOnSpaceLeft,
    )
  }, [usableScreenHeight, defaultCameraViewSize.height])


  const cameraControlStyleWithoutCamera = useMemo<ViewStyle>(() => ({
    paddingTop: VERTICAL_PADDING_WITHOUT_CAMERA,
    paddingBottom: VERTICAL_PADDING_WITHOUT_CAMERA,
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: undefined,
    maxHeight: cameraControlHeightWithoutCamera,
  }), [cameraControlHeightWithoutCamera])

  const cameraControlStyleWithCamera = useMemo<ViewStyle>(() => ({
    paddingTop: VERTICAL_PADDING_WITH_CAMERA,
    paddingBottom: VERTICAL_PADDING_WITH_CAMERA,
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: cameraControlHeightWithCamera,
    maxHeight: undefined,
  }), [cameraControlHeightWithCamera])


  const shouldUseWithoutCameraStyle = (
    cameraControlHeightWithCamera >= (windowDimensions.height / 2)
  )


  const cameraControlStyle = shouldUseWithoutCameraStyle
    ? cameraControlStyleWithoutCamera
    : isShowingCamera
      ? cameraControlStyleWithCamera
      : cameraControlStyleWithoutCamera

  const cameraControlHeight = shouldUseWithoutCameraStyle
    ? cameraControlHeightWithoutCamera
    : isShowingCamera
      ? cameraControlHeightWithCamera
      : cameraControlHeightWithoutCamera


  const cameraControlStyleResult = useMemo(() => ({
    cameraControlStyle,
    cameraControlHeight,
  }), [cameraControlStyle, cameraControlHeight])


  return cameraControlStyleResult
}
