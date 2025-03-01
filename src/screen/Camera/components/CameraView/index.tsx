import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import {
  CameraDevice,
  CameraDeviceFormat,
  Camera as VisionCamera,
} from "react-native-vision-camera"

import {
  FocusIndicator,
  FocusIndicatorRef,
  NoDeviceFound,
  NoPermissionMessage,
  PictureTakenFeedback,
  PictureTakenFeedbackRef,
} from "./components"
import {
  useCameraMargin,
  useCameraSize,
  useDisableFocusOnSettingsOpen,
  useFocusCamera,
  useTakePictureWithCallback,
} from "./hooks"


interface CameraViewProps {
  hasCameraPermission: boolean
  requestCameraPermission: () => Promise<void>
  cameraDevice: CameraDevice | undefined
  cameraFormat: CameraDeviceFormat | undefined
  isShowingCamera: boolean
  isSettingsOpen: boolean
  onPictureTaken: (picturePath: string) => Promise<void>
  onTakePictureError: (error: Error) => Promise<void>
}


export interface CameraViewRef {
  takePicture: () => Promise<void>
}


export const CameraView = forwardRef<CameraViewRef, CameraViewProps>((props, ref) => {
  const {
    hasCameraPermission,
    requestCameraPermission,
    cameraDevice,
    cameraFormat,
    isShowingCamera,
    isSettingsOpen,
    onPictureTaken,
    onTakePictureError,
  } = props


  useImperativeHandle(ref, () => ({
    takePicture,
  }))


  const cameraRef = useRef<VisionCamera>(null)
  const focusIndicatorRef = useRef<FocusIndicatorRef>(null)
  const pictureTakenFeedbackRef = useRef<PictureTakenFeedbackRef>(null)

  const [isFocusEnabled, setIsFocusEnabled] = useState(true)

  const cameraSize = useCameraSize()
  const cameraMargin = useCameraMargin(isShowingCamera)
  const takePicture = useTakePictureWithCallback({
    cameraRef,
    pictureTakenFeedbackRef,
    onPictureTaken,
    onTakePictureError,
  })
  const focusCamera = useFocusCamera({
    cameraDevice,
    cameraRef,
    focusIndicatorRef,
    isFocusEnabled,
    setIsFocusEnabled,
  })

  useDisableFocusOnSettingsOpen({ isSettingsOpen, setIsFocusEnabled })


  const tapGesture = Gesture.Tap()
    .enabled(isShowingCamera && isFocusEnabled)
    .minPointers(1)
    .onEnd(event => {
      runOnJS(focusCamera)(event.x, event.y)
    })


  const style: ViewStyle = {
    alignItems: "center",
    justifyContent: "center",
    marginTop: cameraMargin.top,
    ...cameraSize,
  }


  if (!hasCameraPermission) return (
    <NoPermissionMessage requestCameraPermission={requestCameraPermission} />
  )

  if (!cameraDevice) return (
    <NoDeviceFound />
  )

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={style}>
        <VisionCamera
          ref={cameraRef}
          isActive={isShowingCamera}
          device={cameraDevice}
          format={cameraFormat}
          photo={true}
          audio={false}
          enableZoomGesture={true}
          style={StyleSheet.absoluteFill}
        />

        <FocusIndicator ref={focusIndicatorRef} />

        <PictureTakenFeedback ref={pictureTakenFeedbackRef} />
      </View>
    </GestureDetector>
  )
})
