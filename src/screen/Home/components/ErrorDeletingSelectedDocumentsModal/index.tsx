import { Button, Dialog, Text } from "react-native-paper"

import { translate } from "@locales"


interface ErrorDeletingSelectedDocumentsModalProps {
  isVisible: boolean
  onDismiss: () => void
}


export function ErrorDeletingSelectedDocumentsModal(
  props: ErrorDeletingSelectedDocumentsModalProps,
) {
  const { isVisible, onDismiss } = props


  return (
    <Dialog visible={isVisible}>
      <Dialog.Icon icon={"alert-outline"} />

      <Dialog.Title style={{ textAlign: "center" }}>
        {translate("ErrorDeletingSelectedDocumentsModal_title")}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={"bodyLarge"}>
          {translate("ErrorDeletingSelectedDocumentsModal_description")}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>
          {translate("ok")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
