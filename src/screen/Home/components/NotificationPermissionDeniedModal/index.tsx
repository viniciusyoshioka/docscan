import { useCallback } from "react"
import { Button, Dialog, Text } from "react-native-paper"

import { translate } from "@locales"


interface NotificationPermissionDeniedModalProps {
  isVisible: boolean
  onDismiss: () => void
  requestPermission: () => Promise<void>
}


// TODO: Make this modal a global component to be able to open and visualize it from anywhere
export function NotificationPermissionDeniedModal(props: NotificationPermissionDeniedModalProps) {
  const { isVisible, onDismiss, requestPermission } = props


  const requestNotificationPermission = useCallback(async () => {
    onDismiss()
    await requestPermission()
  }, [onDismiss, requestPermission])


  return (
    <Dialog visible={isVisible}>
      <Dialog.Title>
        {translate("NotificationPermissionDeniedModal_title")}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={"bodyLarge"}>
          {translate("NotificationPermissionDeniedModal_description")}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>
          {translate("NotificationPermissionDeniedModal_close")}
        </Button>

        <Button onPress={requestNotificationPermission}>
          {translate("NotificationPermissionDeniedModal_allow")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
