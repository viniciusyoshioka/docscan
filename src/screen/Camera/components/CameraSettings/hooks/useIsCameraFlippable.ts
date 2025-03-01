import { useMemo } from "react"
import { useCameraDevices } from "react-native-vision-camera"


export function useIsCameraFlippable(): boolean {


  const cameraDevices = useCameraDevices()


  const hasFrontal = useMemo<boolean>(() => {
    return cameraDevices.some(cameraDevice => (
      cameraDevice.position === "front"
    ))
  }, [cameraDevices])

  const hasBack = useMemo<boolean>(() => {
    return cameraDevices.some(cameraDevice => (
      cameraDevice.position === "back"
    ))
  }, [cameraDevices])


  return hasFrontal && hasBack
}
