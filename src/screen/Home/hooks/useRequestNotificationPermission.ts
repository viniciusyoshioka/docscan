import { useCallback, useEffect } from "react"

import { getNotificationPermission } from "@services/permission"


interface RequestNotificationPermissionParams {
  onPermissionDenied: () => void
}


type RequestNotificationPermission = () => Promise<void>


export function useRequestNotificationPermission(
  params: RequestNotificationPermissionParams,
): RequestNotificationPermission {


  const requestPermissions = useCallback(async () => {
    const hasPermission = await getNotificationPermission()
    if (!hasPermission) {
      params.onPermissionDenied()
    }
  }, [params.onPermissionDenied])


  useEffect(() => {
    requestPermissions()
  }, [])


  return requestPermissions
}
