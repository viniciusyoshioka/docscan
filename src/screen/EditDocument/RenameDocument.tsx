import React, { createRef, useEffect, useState } from "react"
import { TextInput } from "react-native"

import { Input, Modal, ModalButton, ModalProps, ModalTitle, ModalViewButton, ModalViewContent } from "../../components"
import { useDocumentData } from "../../services/document"
import { useKeyboard } from "../../hooks"


export interface RenameDocumentProps extends ModalProps { }


export function RenameDocument(props: RenameDocumentProps) {


    const inputRef = createRef<TextInput>()

    const { documentDataState, dispatchDocumentData } = useDocumentData()
    const [documentName, setDocumentName] = useState(documentDataState?.name || "")


    useKeyboard("keyboardDidHide", () => {
        inputRef.current?.blur()
    })


    function renameDocument() {
        dispatchDocumentData({
            type: "rename-document",
            payload: documentName
        })
    }


    useEffect(() => {
        setDocumentName(documentDataState?.name || "")
    }, [props.visible])


    return (
        <Modal {...props}>
            <ModalTitle>
                Renomear documento
            </ModalTitle>

            <ModalViewContent>
                <Input
                    ref={inputRef}
                    placeholder={"Nome do documento"}
                    value={documentName}
                    onChangeText={(text) => setDocumentName(text)}
                    autoFocus={true}
                    selectTextOnFocus={true}
                    style={{ width: "100%" }}
                />
            </ModalViewContent>

            <ModalViewButton>
                <ModalButton
                    text={"Cancelar"}
                    onPress={props.onRequestClose}
                />

                <ModalButton
                    text={"Ok"}
                    onPress={() => {
                        renameDocument()
                        if (props.onRequestClose) {
                            props.onRequestClose()
                        }
                    }}
                />
            </ModalViewButton>
        </Modal>
    )
}
