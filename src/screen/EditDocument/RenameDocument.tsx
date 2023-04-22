import { Button, Modal, ModalActions, ModalProps, ModalTitle } from "@elementium/native"
import { createRef, useEffect, useState } from "react"
import { NativeSyntheticEvent, TextInput } from "react-native"

import { Input } from "../../components"
import { useKeyboard } from "../../hooks"
import { translate } from "../../locales"
import { useDocumentData } from "../../services/document-data"


export interface RenameDocumentProps extends ModalProps { }


export function RenameDocument(props: RenameDocumentProps) {


    const inputRef = createRef<TextInput>()

    const { documentDataState, dispatchDocumentData } = useDocumentData()

    const [documentName, setDocumentName] = useState<string | undefined>(undefined)


    useKeyboard("keyboardDidHide", () => {
        inputRef.current?.blur()
    })


    function renameDocument() {
        if (documentName === undefined) {
            return
        }

        dispatchDocumentData({
            type: "rename-document",
            payload: documentName
        })
    }


    useEffect(() => {
        if (props.visible) {
            setDocumentName(documentDataState?.name ?? "")
        } else {
            setDocumentName(undefined)
        }
    }, [props.visible])

    useEffect(() => {
        if (documentName === undefined) {
            return
        }

        if (!inputRef.current?.isFocused()) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
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
