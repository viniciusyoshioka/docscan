import { useCallback, useMemo, useRef } from 'react'
import type { ViewStyle } from 'react-native'
import { View } from 'react-native'

import { useBackHandler } from '@hooks'
import {
  Permissions,
  PermissionUtils,
  usePermission,
} from '@modules/permission'
import type { CameraViewRef } from './components'
import {
  CameraControl,
  CameraHeader,
  CameraSettings,
  CameraView,
  CheckingOrRequestingCameraPermission,
  NoPermissionMessage,
  useCameraSettings,
} from './components'
import {
  useCameraControlStyle,
  useCameraState,
  useCameraViewMargin,
  useGoBack,
  useGoToDocumentDetail,
  useGoToGallery,
  useIsShowingCamera,
  useShowCameraPermissionErrorAlert,
  useStatusBarStyle,
  useTakePicture,
} from './hooks'


export function Camera() {


  const cameraViewRef = useRef<CameraViewRef | null>(null)


  const showCameraPermissionErrorAlert = useShowCameraPermissionErrorAlert()

  const cameraPermission = usePermission(
    Permissions.CAMERA,
    {
      autoCheckAndRequestIfDenied: true,
      onError: showCameraPermissionErrorAlert,
    },
  )
  const isCheckingOrRequestingCameraPermission = PermissionUtils.isLoading(
    cameraPermission.status,
  )
  const hasErrorCheckingOrRequestingCameraPermission = PermissionUtils.hasError(
    cameraPermission.status,
  )
  const isCameraPermissionDeniedOrUnknown = PermissionUtils.isDeniedOrUnknown(
    cameraPermission.status,
  )
  const isCameraPermissionGranted = PermissionUtils.isGranted(
    cameraPermission.status,
  )

  const showIsLoadingCameraPermission = isCheckingOrRequestingCameraPermission
  const showNoCameraPermission = (
    hasErrorCheckingOrRequestingCameraPermission
    || isCameraPermissionDeniedOrUnknown
  )

  const requestCameraPermission = useCallback(async () => {
    await cameraPermission.request()
  }, [cameraPermission])


  const cameraSettings = useCameraSettings()
  const { cameraState, onCameraStateLoaded } = useCameraState()

  const isShowingCamera = useIsShowingCamera({
    isCameraPermissionGranted,
  })

  const cameraViewMargin = useCameraViewMargin({
    isShowingCamera,
  })

  const { cameraControlStyle, cameraControlHeight } = useCameraControlStyle({
    isShowingCamera,
  })


  const goBack = useGoBack({
    isSettingsVisible: cameraSettings.isVisible,
    hideSettings: cameraSettings.hide,
  })

  const goToGallery = useGoToGallery()

  const takePicture = useTakePicture(cameraViewRef)

  const goToDocumentDetail = useGoToDocumentDetail()


  useBackHandler(goBack)
  useStatusBarStyle({ isShowingCamera })


  const screenStyle = useMemo<ViewStyle>(() => ({
    flex: 1,
    backgroundColor: isShowingCamera ? 'black' : undefined,
  }), [isShowingCamera])

  const cameraViewWrapperStyle = useMemo<ViewStyle>(() => ({
    display: isCameraPermissionGranted ? 'flex' : 'none',
    marginTop: cameraViewMargin.top,
  }), [isCameraPermissionGranted, cameraViewMargin])


  return (
    <View style={screenStyle}>
      <CameraHeader
        goBack={goBack}
        openCameraSettings={cameraSettings.show}
        isShowingCamera={isShowingCamera}
      />

      <View style={{ display: isCameraPermissionGranted ? 'none' : 'flex', flex: 1 }}>
        <CheckingOrRequestingCameraPermission
          style={{ display: showIsLoadingCameraPermission ? 'flex' : 'none' }}
        />

        <NoPermissionMessage
          cameraControlHeight={cameraControlHeight}
          requestCameraPermission={requestCameraPermission}
          style={{ display: showNoCameraPermission ? 'flex' : 'none' }}
        />
      </View>

      <View style={cameraViewWrapperStyle}>
        <CameraView
          ref={cameraViewRef}
          isShowingCamera={isShowingCamera}
          isSettingsOpen={cameraSettings.isVisible}
          onCameraStateLoaded={onCameraStateLoaded}
        />
      </View>

      <CameraControl
        isShowingCamera={isShowingCamera}
        cameraControlStyle={cameraControlStyle}
        goToGallery={goToGallery}
        takePicture={takePicture}
        goToDocumentDetail={goToDocumentDetail}
      />

      <CameraSettings
        cameraState={cameraState}
        cameraControlHeight={cameraControlHeight}
        isVisible={cameraSettings.isVisible}
        onRequestClose={cameraSettings.hide}
        isShowingCamera={isShowingCamera}
      />
    </View>
  )
}
