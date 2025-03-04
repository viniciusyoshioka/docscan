import { Button, Dialog, Text } from "react-native-paper"

import { translate } from "@locales"


interface ErrorImportingImagesModalProps {
  isVisible: boolean
  onDismiss: () => void
}


export function ErrorImportingImagesModal(props: ErrorImportingImagesModalProps) {
  return (
    <Dialog visible={props.isVisible}>
      <Dialog.Icon icon={"alert-outline"} />

      <Dialog.Title style={{ textAlign: "center" }}>
        {translate("ErrorImportingImagesModal_title")}
      </Dialog.Title>

      <Dialog.Content>
        <Text variant={"bodyLarge"}>
          {translate("ErrorImportingImagesModal_text")}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button children={"Ok"} onPress={props.onDismiss} />
      </Dialog.Actions>
    </Dialog>
  )
}
