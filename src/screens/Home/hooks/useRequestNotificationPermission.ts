import { useCallback, useEffect } from 'react'
import { Linking } from 'react-native'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useLogger } from '@modules/logger'
import {
  Permissions,
  PermissionUtils,
  usePermission,
} from '@modules/permission'
import { getErrorStackTrace } from '@utils'


interface RequestNotificationPermissionParams {
  onPermissionDenied: () => void
}


export function useRequestNotificationPermission(
  params?: RequestNotificationPermissionParams,
): void {


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()
  const notificationPermission = usePermission(
    Permissions.NOTIFICATION,
    {
      autoCheckAndRequestIfDenied: true,
    },
  )

  const showNotificationPermissionDeniedAlert = useCallback(() => {
    alert.show({
      title: t(
        'NotificationPermissionDeniedModal_title',
        { ns: Namespaces.APP },
      ),
      description: t(
        'NotificationPermissionDeniedModal_description',
        { ns: Namespaces.APP },
      ),
      buttons: [
        {
          label: t(
            'NotificationPermissionDeniedModal_close',
            { ns: Namespaces.APP },
          ),
          onPress: ({ dismiss }) => {
            dismiss()
          },
        },
        {
          label: t(
            'NotificationPermissionDeniedModal_allow',
            { ns: Namespaces.APP },
          ),
          onPress: ({ dismiss }) => {
            dismiss()
            Linking.openSettings()
          },
        },
      ],
    })
  }, [alert, t])


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
