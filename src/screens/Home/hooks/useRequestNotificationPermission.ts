import { useCallback, useEffect } from 'react'

import { useLogger } from '@modules/logger'
import {
  Permissions,
  PermissionUtils,
  usePermission,
} from '@modules/permission'
import { getErrorStackTrace } from '@utils'
import { useShowNotificationPermissionDeniedAlert } from './useShowNotificationPermissionDeniedAlert.ts'


interface RequestNotificationPermissionParams {
  onPermissionDenied: () => void
}


export function useRequestNotificationPermission(
  params?: RequestNotificationPermissionParams,
): void {


  const logger = useLogger()
  const notificationPermission = usePermission(
    Permissions.NOTIFICATION,
    {
      autoCheckAndRequestIfDenied: true,
    },
  )

  const showNotificationPermissionDeniedAlert =
    useShowNotificationPermissionDeniedAlert()


  const onPermissionStatusChange = useCallback(async () => {
    if (notificationPermission.error) {
      const errorMessage = `Error requesting notification permission: "${notificationPermission.error.message}"`
      const errorStack = getErrorStackTrace(notificationPermission.error)
      await logger.error(errorMessage, errorStack)
      return
    }

    const isDenied = PermissionUtils.isDenied(notificationPermission.status)
    if (isDenied) {
      await logger.debug('Notification permission denied')
      showNotificationPermissionDeniedAlert()
      params?.onPermissionDenied()
    }
  }, [
    notificationPermission,
    logger,
    showNotificationPermissionDeniedAlert,
    params?.onPermissionDenied,
  ])


  useEffect(() => {
    onPermissionStatusChange()
  }, [notificationPermission.status])
}
