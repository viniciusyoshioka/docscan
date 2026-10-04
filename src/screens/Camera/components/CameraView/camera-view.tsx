import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import type { ViewStyle } from 'react-native'
import { StyleSheet, View } from 'react-native'
import { GestureDetector, useTapGesture } from 'react-native-gesture-handler'
import type { CameraRef } from 'react-native-vision-camera'
import {
  Camera,
  useCameraDevice,
  usePhotoOutput,
} from 'react-native-vision-camera'
import { scheduleOnRN } from 'react-native-worklets'

import type { AbsolutePath } from '@modules/file-system'
import type { CameraState } from '../../hooks'
import { useCameraViewSize } from '../../hooks'
import type {
  FocusIndicatorRef,
  PictureTakenFeedbackRef,
} from './components'
import {
  CameraDeviceError,
  FocusIndicator,
  NoDeviceFound,
  PictureTakenFeedback,
} from './components'
import {
  useCameraError,
  useFocusCamera,
  useLoadCameraState,
  useMapCameraFlash,
  useMapCameraPosition,
  useTakePhoto,
} from './hooks'


interface CameraViewProps {
  isShowingCamera: boolean
  isSettingsOpen: boolean
  onCameraStateLoaded?: (cameraState: CameraState) => void
  onCameraInitializationError?: (error: Error) => void
}


export interface CameraViewRef {
  takePhoto: () => Promise<AbsolutePath>
}


export const CameraView = forwardRef<CameraViewRef, CameraViewProps>((
  props,
  ref,
) => {
  const {
    isShowingCamera,
    isSettingsOpen,
    onCameraStateLoaded,
    onCameraInitializationError,
  } = props


  const cameraRef = useRef<CameraRef>(null)
  const focusIndicatorRef = useRef<FocusIndicatorRef>(null)
  const pictureTakenFeedbackRef = useRef<PictureTakenFeedbackRef>(null)


  useLoadCameraState({ onCameraStateLoaded })
  const cameraError = useCameraError({
    onErrorCallback: onCameraInitializationError,
  })


  const mappedCameraPosition = useMapCameraPosition()

  const cameraDevice = useCameraDevice(mappedCameraPosition)
  const photoOutput = usePhotoOutput({
    containerFormat: 'jpeg',
    quality: 1,
    qualityPrioritization: 'balanced',
  })

  const mappedCameraFlash = useMapCameraFlash(cameraDevice)
  const cameraViewSize = useCameraViewSize()


  const takePhoto = useTakePhoto({
    photoOutput,
    mappedCameraFlash,
    pictureTakenFeedbackRef,
  })


  useImperativeHandle(
    ref,
    () => ({
      takePhoto,
    }),
    [takePhoto],
  )


  const { focus, isFocusEnabled } = useFocusCamera({
    cameraDevice,
    cameraRef,
    focusIndicatorRef,
    isSettingsOpen,
  })

  const tapGesture = useTapGesture({
    enabled: isShowingCamera && isFocusEnabled,
    minPointers: 1,
    onFinalize: event => {
      scheduleOnRN(focus, event.x, event.y)
    },
  })


  const wrapperStyle: ViewStyle = useMemo(() => ({
    alignItems: 'center',
    justifyContent: 'center',
    width: cameraViewSize.width,
    height: cameraViewSize.height,
  }), [cameraViewSize])


  if (!cameraDevice) {
    return <NoDeviceFound />
  }


  if (cameraError.error) {
    return <CameraDeviceError />
  }


  return (
    <GestureDetector gesture={tapGesture}>
      <View style={wrapperStyle}>
        <Camera
          ref={cameraRef}
          isActive={isShowingCamera}
          device={cameraDevice}
          outputs={[photoOutput]}
          style={StyleSheet.absoluteFill}
          onError={cameraError.onError}
        />

        <FocusIndicator ref={focusIndicatorRef} />

        <PictureTakenFeedback ref={pictureTakenFeedbackRef} />
      </View>
    </GestureDetector>
  )
})
