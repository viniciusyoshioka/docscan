import React, { createRef, useEffect, useState } from "react"
import { TextInput } from "react-native"

import { ModalFullscreenProps } from "../../component/ModalFullscreen"
import { Input } from "../../component/Input"
import { ModalButton, ModalTitle, ModalViewButton } from "../../component/ModalComponent"
import { MyModal } from "../../component/MyModal"
import { useKeyboard } from "../../service/hook"


export interface RenameDocumentProps extends ModalFullscreenProps {
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
        <MyModal
            modalStyle={{elevation: 6, paddingHorizontal: 10}}
            {...props}
        >
            <>
                <ModalTitle>
                    Renomear documento
                </ModalTitle>

                <Input 
                    ref={inputRef}
                    placeholder={"Nome do documento"}
                    value={documentName}
                    onChangeText={(text) => setDocumentName(text)}
                    autoFocus={true}
                    selectTextOnFocus={true}
                />

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
