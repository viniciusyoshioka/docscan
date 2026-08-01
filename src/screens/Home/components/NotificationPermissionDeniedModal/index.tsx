import { useCallback } from 'react'
import { Linking } from 'react-native'
import { Button, Dialog, Text } from 'react-native-paper'

import { Namespaces, useLocale } from '@locale'


interface NotificationPermissionDeniedModalProps {
  isVisible: boolean
  onDismiss: () => void
}


// TODO: Make this modal a global component to be able to
// open and visualize it from anywhere
export function NotificationPermissionDeniedModal(
  props: NotificationPermissionDeniedModalProps,
) {
  const { isVisible, onDismiss } = props


  const { t } = useLocale()


  const requestNotificationPermission = useCallback(() => {
    onDismiss()
    Linking.openSettings()
  }, [onDismiss])


  return (
    <Dialog visible={isVisible}>
      <Dialog.Title>
        {t(
          'NotificationPermissionDeniedModal_title',
          { ns: Namespaces.APP },
        )}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={'bodyLarge'}>
          {t(
            'NotificationPermissionDeniedModal_description',
            { ns: Namespaces.APP },
          )}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>
          {t(
            'NotificationPermissionDeniedModal_close',
            { ns: Namespaces.APP },
          )}
        </Button>

        <Button onPress={requestNotificationPermission}>
          {t(
            'NotificationPermissionDeniedModal_allow',
            { ns: Namespaces.APP },
          )}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
