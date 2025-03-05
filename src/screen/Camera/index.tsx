import { useRef } from "react"
import { View, ViewStyle } from "react-native"
import { useModal } from "react-native-paper-towel"
import { useCameraDevice, useCameraFormat } from "react-native-vision-camera"

import { useBackHandler } from "@hooks"
import { useSettings } from "@libs/settings"
import {
  CameraControl,
  CameraHeader,
  CameraSettings,
  CameraView,
  CameraViewRef,
} from "./components"
import {
  useAddPictureFromGallery,
  useEditDocument,
  useGoBack,
  useIsShowingCamera,
  useOnPictureTaken,
  useOnTakePictureError,
  useRequestCameraPermission,
  useStatusBarStyle,
  useTakePicture,
} from "./hooks"
import { getCameraRatioNumber } from "./utils"


// TODO: Add support to multiple back cameras
// TODO: Add zoom indicator
export function Camera() {


  const { settings } = useSettings()

  const cameraViewRef = useRef<CameraViewRef>(null)

  const cameraDevice = useCameraDevice(settings.camera.position)
  const cameraFormat = useCameraFormat(cameraDevice, [
    { photoAspectRatio: getCameraRatioNumber(settings.camera.ratio) },
    { photoResolution: "max" },
  ])

  const cameraSettings = useModal()
  const { hasCameraPermission, requestCameraPermission } = useRequestCameraPermission()
  const isShowingCamera = useIsShowingCamera({ hasCameraPermission, cameraDevice })


  const goBack = useGoBack({
    isSettingsVisible: cameraSettings.isVisible,
    hideSettings: cameraSettings.hide,
  })

  useBackHandler(goBack)
  useStatusBarStyle(isShowingCamera)

  const addPictureFromGallery = useAddPictureFromGallery()
  const takePicture = useTakePicture(cameraViewRef)
  const editDocument = useEditDocument()

  const onPictureTaken = useOnPictureTaken()
  const onTakePictureError = useOnTakePictureError()


  const screenStyle: ViewStyle = {
    flex: 1,
    backgroundColor: isShowingCamera ? "black" : undefined,
  }


  return (
    <View style={screenStyle}>
      <CameraHeader
        goBack={goBack}
        openCameraSettings={cameraSettings.show}
        isShowingCamera={isShowingCamera}
      />

      <CameraView
        ref={cameraViewRef}
        hasCameraPermission={hasCameraPermission}
        requestCameraPermission={requestCameraPermission}
        cameraDevice={cameraDevice}
        cameraFormat={cameraFormat}
        isShowingCamera={isShowingCamera}
        isSettingsOpen={cameraSettings.isVisible}
        onPictureTaken={onPictureTaken}
        onTakePictureError={onTakePictureError}
      />

      <CameraControl
        isShowingCamera={isShowingCamera}
        addPictureFromGallery={addPictureFromGallery}
        takePicture={takePicture}
        editDocument={editDocument}
      />

      <CameraSettings
        isVisible={cameraSettings.isVisible}
        onRequestClose={cameraSettings.hide}
        isShowingCamera={isShowingCamera}
      />
    </View>
  )
}
