import { Button, Dialog, Text } from "react-native-paper"

import { translate } from "@locales"


interface DeleteSelectedDocumentsModalProps {
  isVisible: boolean
  onDismiss: () => void
  deleteSelectedDocuments: () => void
  exitSelection: () => void
}


export function DeleteSelectedDocumentsModal(props: DeleteSelectedDocumentsModalProps) {
  const { isVisible, onDismiss, deleteSelectedDocuments, exitSelection } = props


  function handleDeleteSelectedDocuments() {
    deleteSelectedDocuments()
    onDismiss()
    exitSelection()
  }


  return (
    <Dialog visible={isVisible}>
      <Dialog.Icon icon={"trash-can-outline"} />

      <Dialog.Title style={{ textAlign: "center" }}>
        {translate("DeleteSelectedDocumentsModal_title")}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={"bodyLarge"}>
          {translate("DeleteSelectedDocumentsModal_description")}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>
          {translate("cancel")}
        </Button>

        <Button onPress={handleDeleteSelectedDocuments}>
          {translate("delete")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
