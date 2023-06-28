import { Button, Modal, ModalActions, ModalProps, ModalTitle } from "@elementium/native"
import { useRoute } from "@react-navigation/native"
import { createRef, useEffect, useState } from "react"
import { NativeSyntheticEvent, TextInput } from "react-native"

import { Input } from "../../components"
import { DocumentSchema, useDocumentRealm } from "../../database"
import { useKeyboard } from "../../hooks"
import { translate } from "../../locales"
import { DocumentService } from "../../services/document"
import { RouteParamProps } from "../../types"


export interface RenameDocumentProps extends ModalProps {}


export function RenameDocument(props: RenameDocumentProps) {


    const { params } = useRoute<RouteParamProps<"EditDocument">>()

    const documentRealm = useDocumentRealm()
    const documentId = params
        ? Realm.BSON.ObjectID.createFromHexString(params.documentId)
        : null
    const document = documentId
        ? documentRealm.objectForPrimaryKey<DocumentSchema>("DocumentSchema", documentId)
        : null

    const inputRef = createRef<TextInput>()

    const [documentName, setDocumentName] = useState<string | undefined>(getDocumentName())


    useKeyboard("keyboardDidHide", () => {
        inputRef.current?.blur()
    })


    function getDocumentName() {
        return document ? document.name : DocumentService.getNewName()
    }

    function renameDocument() {
        if (documentName === undefined) return

        documentRealm.write(() => {
            if (document === null) return
            // TODO create document if not exists and its renamed
            document.name = documentName
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
