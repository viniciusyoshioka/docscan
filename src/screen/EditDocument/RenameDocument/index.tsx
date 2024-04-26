import { useNavigation } from "@react-navigation/native"
import { createRef, useState } from "react"
import { Alert, TextInput as RNTextInput } from "react-native"
import { Button, Dialog, TextInput } from "react-native-paper"
import { Input } from "react-native-paper-towel"

import { useBackHandler, useKeyboard } from "@hooks"
import { DocumentStateData, useDocumentState } from "@lib/document-state"
import { useLogger } from "@lib/log"
import { translate } from "@locales"
import { NavigationProps } from "@router"
import { stringifyError } from "@utils"
import { useRenameDocument } from "./useRenameDocument"


export function RenameDocument() {


  const navigation = useNavigation<NavigationProps<"RenameDocument">>()

  const inputRef = createRef<RNTextInput>()

  const log = useLogger()
  const { documentState } = useDocumentState()
  const renameDocument = useRenameDocument()

  const { document } = documentState as DocumentStateData
  const [documentName, setDocumentName] = useState(document.name)


  useKeyboard("keyboardDidHide", () => inputRef.current?.blur())


  useBackHandler(goBack)


  function goBack() {
    navigation.goBack()
    return true
  }

  function handleRenameDocument() {
    try {
      renameDocument(documentName)
      goBack()
    } catch (error) {
      log.error(`Unexpected error when renaming document: ${stringifyError(error)}`)
      Alert.alert(
        translate("warn"),
        translate("RenameDocument_alert_unexpectedErrorRenamingDocument_text")
      )
    }
  }


  return (
    <Dialog visible onDismiss={goBack}>
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
        <Button
          children={translate("cancel")}
          onPress={goBack}
        />

        <Button
          children={translate("ok")}
          onPress={handleRenameDocument}
        />
      </Dialog.Actions>
    </Dialog>
  )
}
