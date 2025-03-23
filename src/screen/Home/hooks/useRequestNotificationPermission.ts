import { useCallback, useEffect } from "react"

import { useLogger } from "@libs/logger"
import { getNotificationPermission } from "@services/permission"


interface RequestNotificationPermissionParams {
  onPermissionDenied: () => void
}


export function useRequestNotificationPermission(
  params: RequestNotificationPermissionParams,
): void {


  const logger = useLogger()


  const requestPermissions = useCallback(async () => {
    const hasPermission = await getNotificationPermission()
    if (!hasPermission) {
      await logger.debug("Notification permission denied")
      params.onPermissionDenied()
    }
  }, [params.onPermissionDenied, logger])


  useEffect(() => {
    requestPermissions()
  }, [])
}
