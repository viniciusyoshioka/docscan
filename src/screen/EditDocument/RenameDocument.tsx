import { Button, Modal, ModalActions, ModalProps, ModalTitle } from "@elementium/native"
import { Realm } from "@realm/react"
import { createRef, useEffect, useState } from "react"
import { NativeSyntheticEvent, TextInput } from "react-native"

import { Input } from "../../components"
import { DocumentSchema, useDocumentModel, useDocumentRealm } from "../../database"
import { useKeyboard } from "../../hooks"
import { translate } from "../../locales"
import { DocumentService } from "../../services/document"


export interface RenameDocumentProps extends ModalProps {}


export function RenameDocument(props: RenameDocumentProps) {


    const { documentModel, setDocumentModel } = useDocumentModel()
    const documentRealm = useDocumentRealm()
    const document = documentModel?.document ?? null

    const inputRef = createRef<TextInput>()

    const [documentName, setDocumentName] = useState<string | undefined>(getDocumentName())


    useKeyboard("keyboardDidHide", () => {
        inputRef.current?.blur()
    })


    function getDocumentName() {
        return document?.name ?? DocumentService.getNewName()
    }

    function renameDocument() {
        if (documentName === undefined) return

        documentRealm.write(() => {
            const now = Date.now()
            if (document === null) {
                const createdDocument = documentRealm.create(DocumentSchema, {
                    createdAt: now,
                    modifiedAt: now,
                    name: documentName,
                })

                setDocumentModel({ document: createdDocument, pictures: new Realm.Results() })
            } else {
                document.name = documentName
                document.modifiedAt = now
            }
        })
    }


    useEffect(() => {
        props.visible
            ? setDocumentName(getDocumentName())
            : setDocumentName(undefined)
    }, [props.visible])

    useEffect(() => {
        if (documentName === undefined) return

        if (!inputRef.current?.isFocused()) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [documentName])


    return (
        <Modal {...props}>
            <ModalTitle>
                {translate("RenameDocument_title")}
            </ModalTitle>

            <Input
                ref={inputRef}
                placeholder={translate("RenameDocument_documentName_placeholder")}
                value={documentName}
                onChangeText={text => setDocumentName(text)}
                selectTextOnFocus={true}
                style={{ width: "100%", marginTop: 16 }}
            />

            <ModalActions>
                <Button
                    variant={"text"}
                    text={translate("cancel")}
                    onPress={props.onRequestClose}
                />

                <Button
                    variant={"text"}
                    text={translate("ok")}
                    onPress={() => {
                        renameDocument()
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />
            </ModalActions>
        </Modal>
    )
}
