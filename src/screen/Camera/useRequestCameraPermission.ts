import { useEffect, useState } from "react"

import { getCameraPermission } from "@services/permission"


export type CameraPermission = {
  hasCameraPermission: boolean
  requestCameraPermission: () => Promise<void>
}


export function useRequestCameraPermission(): CameraPermission {


  const [hasCameraPermission, setHasCameraPermission] = useState(false)


  async function requestCameraPermission() {
    const hasCameraPermission = await getCameraPermission()
    setHasCameraPermission(hasCameraPermission)
  }


  useEffect(() => {
    requestCameraPermission()
  }, [])


  return { hasCameraPermission, requestCameraPermission }
}
