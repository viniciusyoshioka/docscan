import { useMemo } from "react"
import { Dimensions, StatusBar, ViewStyle, useWindowDimensions } from "react-native"

import { getCameraSizeToFitInScreen } from "../../../utils"
import { CAMERA_HEADER_HEIGHT } from "../../CameraHeader"
import { ACTION_BUTTON_SIZE, CAPTURE_BUTTON_SIZE } from "../components"


type CameraControlStyle = {
  style: ViewStyle
  height: number
}


export function useCameraControlStyle(isShowingCamera: boolean): CameraControlStyle {


  const windowDimentions = useWindowDimensions()
  const screenDimentions = Dimensions.get("screen")
  const statusBarHeight = StatusBar.currentHeight ?? 0


  const usableScreenWidth = screenDimentions.width
  const usableScreenHeight = screenDimentions.height - statusBarHeight
  const defaultCameraSize = useMemo(() => (
    getCameraSizeToFitInScreen(
      { width: usableScreenWidth, height: usableScreenHeight },
      "4:3",
    )
  ), [usableScreenWidth, usableScreenHeight])


  const paddingVerticalWithoutCamera = 16
  const paddingVerticalWithCamera = 32


  const heightWithoutCamera = useMemo(() => {
    const paddingVertical = (2 * paddingVerticalWithoutCamera)

    const maxHeightBasedOnCaptureButton = CAPTURE_BUTTON_SIZE + paddingVertical
    const maxHeightBasedOnActionButton = ACTION_BUTTON_SIZE + paddingVertical
    return Math.max(maxHeightBasedOnCaptureButton, maxHeightBasedOnActionButton)
  }, [])

  // TODO: Add height limit for larger screens
  const heightWithCamera = useMemo(() => {
    const paddingVertical = (2 * paddingVerticalWithCamera)

    const maxHeightBasedOnCaptureButton = CAPTURE_BUTTON_SIZE + paddingVertical
    const maxHeightBasedOnActionButton = ACTION_BUTTON_SIZE + paddingVertical
    const maxHeightBasedOnSpaceLeft = usableScreenHeight
      - CAMERA_HEADER_HEIGHT
      - defaultCameraSize.height
    return Math.max(
      maxHeightBasedOnCaptureButton,
      maxHeightBasedOnActionButton,
      maxHeightBasedOnSpaceLeft,
    )
  }, [usableScreenHeight, defaultCameraSize.height])


  const styleWithouCamera = useMemo<ViewStyle>(() => ({
    paddingTop: paddingVerticalWithoutCamera,
    paddingBottom: paddingVerticalWithoutCamera,
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: undefined,
    maxHeight: heightWithoutCamera,
  }), [paddingVerticalWithoutCamera, heightWithoutCamera])

  const styleWithCamera = useMemo<ViewStyle>(() => ({
    paddingTop: paddingVerticalWithCamera,
    paddingBottom: paddingVerticalWithCamera,
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: heightWithCamera,
    maxHeight: undefined,
  }), [paddingVerticalWithCamera, heightWithCamera])


  const shouldUseWithoutCameraStyle = (heightWithCamera >= (windowDimentions.height / 2))

  const cameraControlStyle = shouldUseWithoutCameraStyle
    ? styleWithouCamera
    : isShowingCamera
      ? styleWithCamera
      : styleWithouCamera

  const cameraControlHeight = shouldUseWithoutCameraStyle
    ? heightWithoutCamera
    : isShowingCamera
      ? heightWithCamera
      : heightWithoutCamera


  return {
    style: cameraControlStyle,
    height: cameraControlHeight,
  }
}
