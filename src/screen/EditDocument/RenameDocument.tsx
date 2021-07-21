import React, { createRef, useEffect, useState } from "react"
import { TextInput } from "react-native"

import { Input, ModalButton, ModalProps, ModalTitle, ModalViewButton, ModalViewContent, MyModal } from "../../component"
import { useKeyboard } from "../../service/hook"


export interface RenameDocumentProps extends ModalProps {
    documentName: string,
    setDocumentName: (newDocumentName: string) => void
}


export function RenameDocument(props: RenameDocumentProps) {


    const inputRef = createRef<TextInput>()

    const [documentName, setDocumentName] = useState(props.documentName)


    useKeyboard("keyboardDidHide", () => {
        inputRef.current?.blur()
    })


    useEffect(() => {
        setDocumentName(props.documentName)
    }, [props.visible])


    return (
        <MyModal {...props}>
            <>
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
                        onPress={() => props.setVisible(false)}
                    />

                    <ModalButton
                        text={"Ok"}
                        onPress={() => {
                            props.setDocumentName(documentName)
                            props.setVisible(false)
                        }}
                    />
                </ModalViewButton>
            </>
        </MyModal>
    )
}
