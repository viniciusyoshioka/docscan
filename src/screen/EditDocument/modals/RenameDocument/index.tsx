import { useNavigation } from "@react-navigation/native"
import { createRef, useState } from "react"
import { TextInput as RNTextInput } from "react-native"
import { Button, Dialog, TextInput } from "react-native-paper"
import { Input } from "react-native-paper-towel"

import { useBackHandler, useKeyboard } from "@hooks"
import { useDocumentState } from "@libs/document-state"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { DocumentService } from "@services/document"
import { useRenameDocument } from "./hooks"


export function RenameDocument() {


  const navigation = useNavigation<NavigationProps<"RenameDocument">>()

  const { documentState } = useDocumentState()

  const inputRef = createRef<RNTextInput>()

  const initialDocumentName = documentState?.document.name ?? DocumentService.getNewName()
  const [documentName, setDocumentName] = useState(initialDocumentName)

  const renameDocument = useRenameDocument()


  function goBack() {
    navigation.goBack()
    return true
  }

  function onDismiss() {
    const isInputFocused = inputRef.current?.isFocused()
    if (isInputFocused) {
      inputRef.current?.blur()
      return
    }

    goBack()
  }

  async function onRenameDocument() {
    await renameDocument(documentName)
    goBack()
  }


  useKeyboard("keyboardDidHide", () => inputRef.current?.blur())
  useBackHandler(goBack)


  return (
    <Dialog visible onDismiss={onDismiss}>
      <Dialog.Title>
        {translate("RenameDocument_title")}
      </Dialog.Title>

      <Dialog.Content>
        <Input
          ref={inputRef}
          placeholder={translate("RenameDocument_documentName_placeholder")}
          value={documentName}
          onChangeText={setDocumentName}
          autoFocus={true}
          right={(
            <TextInput.Icon
              icon={"close"}
              size={18}
              onPress={() => setDocumentName("")}
            />
          )}
        />
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={goBack}>
          {translate("cancel")}
        </Button>

        <Button onPress={onRenameDocument}>
          {translate("ok")}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
