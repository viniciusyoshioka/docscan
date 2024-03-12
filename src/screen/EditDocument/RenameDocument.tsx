import { useNavigation } from "@react-navigation/native"
import { createRef, useEffect, useState } from "react"
import { TextInput } from "react-native"
import { Button, Dialog } from "react-native-paper"

import { Input } from "@components"
import { DocumentPictureSchema, DocumentSchema, useDocumentModel, useDocumentRealm } from "@database"
import { useBackHandler, useKeyboard } from "@hooks"
import { translate } from "@locales"
import { NavigationParamProps } from "@router"
import { DocumentService } from "@services/document"


export function RenameDocument() {


    const navigation = useNavigation<NavigationParamProps<"RenameDocument">>()

    const documentRealm = useDocumentRealm()
    const { documentModel, setDocumentModel } = useDocumentModel()
    const document = documentModel?.document ?? null
    const initialDocumentName = document?.name ?? DocumentService.getNewName()

    const inputRef = createRef<TextInput>()

    const [documentName, setDocumentName] = useState(initialDocumentName)


    useKeyboard("keyboardDidHide", () => inputRef.current?.blur())


    useBackHandler(goBack)


    function goBack() {
        navigation.goBack()
        return true
    }

    function renameDocument() {
        const renamedDocument = documentRealm.write(() => {
            if (document) {
                document.name = documentName
                document.modifiedAt = Date.now()
                return document
            }

            const createdDocument = documentRealm.create(DocumentSchema, { name: documentName })
            return createdDocument
        })

        const pictures = documentRealm
            .objects(DocumentPictureSchema)
            .filtered("belongsToDocument = $0", renamedDocument.id)
            .sorted("position")
        setDocumentModel({ document: renamedDocument, pictures })
    }


    useEffect(() => {
        setTimeout(() => {
            if (!inputRef.current) return
            inputRef.current.focus()
        }, 100)
    }, [])


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
                    selectTextOnFocus={true}
                    style={{ marginTop: 16 }}
                />
            </Dialog.Content>

            <Dialog.Actions>
                <Button
                    children={translate("cancel")}
                    onPress={goBack}
                />

                <Button
                    children={translate("ok")}
                    onPress={() => {
                        renameDocument()
                        goBack()
                    }}
                />
            </Dialog.Actions>
        </Dialog>
    )
}
