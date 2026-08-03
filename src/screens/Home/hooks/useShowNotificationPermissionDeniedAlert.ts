import { useCallback } from 'react'
import { Linking } from 'react-native'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'


type ShowNotificationPermissionDeniedAlert = () => void


export function useShowNotificationPermissionDeniedAlert():
ShowNotificationPermissionDeniedAlert {


  const alert = useAlert()
  const { t } = useLocale()


  const showNotificationPermissionDeniedAlert =
    useCallback<ShowNotificationPermissionDeniedAlert>(() => {
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


  return showNotificationPermissionDeniedAlert
}
