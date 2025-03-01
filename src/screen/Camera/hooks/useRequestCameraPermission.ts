import { useCallback, useEffect, useState } from "react"

import { getCameraPermission } from "@services/permission"


interface CameraPermission {
  hasCameraPermission: boolean
  requestCameraPermission: () => Promise<void>
}


export function useRequestCameraPermission(): CameraPermission {


  const [hasCameraPermission, setHasCameraPermission] = useState(false)


  const requestCameraPermission = useCallback(async () => {
    const hasPermission = await getCameraPermission()
    setHasCameraPermission(hasPermission)
  }, [])


  useEffect(() => {
    requestCameraPermission()
  }, [])


  return { hasCameraPermission, requestCameraPermission }
}
