import { createRef, useEffect, useState } from "react"
import { NativeSyntheticEvent, TextInput } from "react-native"

import { Input, Modal, ModalButton, ModalProps, ModalTitle, ModalViewButton, ModalViewContent } from "../../components"
import { useKeyboard } from "../../hooks"
import { translate } from "../../locales"
import { useDocumentData } from "../../services/document"


export interface RenameDocumentProps extends ModalProps { }


export function RenameDocument(props: RenameDocumentProps) {


    const inputRef = createRef<TextInput>()

    const { documentDataState, dispatchDocumentData } = useDocumentData()

    const [documentName, setDocumentName] = useState(documentDataState?.name ?? "")


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
        setDocumentName(documentDataState?.name ?? "")

        if (props.visible) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }, [props.visible])


    return (
        <Modal {...props}>
            <ModalTitle>
                {translate("RenameDocument_title")}
            </ModalTitle>

            <ModalViewContent>
                <Input
                    ref={inputRef}
                    placeholder={translate("RenameDocument_documentName_placeholder")}
                    value={documentName}
                    onChangeText={text => setDocumentName(text)}
                    selectTextOnFocus={true}
                    style={{ width: "100%" }}
                />
            </ModalViewContent>

            <ModalViewButton>
                <ModalButton
                    text={translate("cancel")}
                    onPress={props.onRequestClose}
                />

                <ModalButton
                    text={translate("ok")}
                    onPress={() => {
                        renameDocument()
                        if (props.onRequestClose) {
                            props.onRequestClose({} as NativeSyntheticEvent<unknown>)
                        }
                    }}
                />
            </ModalViewButton>
        </Modal>
    )
}
