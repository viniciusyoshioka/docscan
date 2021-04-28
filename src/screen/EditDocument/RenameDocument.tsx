import React, { useEffect, useState } from "react"

import { ModalFullscreen, ModalFullscreenProps } from "../../component/ModalFullscreen"
import { Input } from "../../component/Input"
import { ModalButton, ModalTitle, ModalView, ModalViewButton, ModalViewContent } from "../../component/ModalComponent"


export interface RenameDocumentProps extends ModalFullscreenProps {
    documentName: string,
    setDocumentName: (newDocumentName: string) => void
}


export function RenameDocument(props: RenameDocumentProps) {


    const [documentName, setDocumentName] = useState(props.documentName)


    useEffect(() => {
        setDocumentName(props.documentName)
    }, [props.visible])


    return (
        <ModalFullscreen {...props}>
            <ModalView>
                <ModalTitle>
                    Renomear documento
                </ModalTitle>

                <ModalViewContent>
                    <Input 
                        placeholder={"Nome do documento"}
                        value={documentName}
                        onChangeText={(text) => setDocumentName(text)}
                        autoFocus={true}
                        selectTextOnFocus={true}
                    />
                </ModalViewContent>

                <ModalViewButton>
                    <ModalButton 
                        text={"Cancelar"} 
                        onPress={() => props.setVisible(false)} />

                    <ModalButton 
                        text={"Ok"} 
                        onPress={() => {
                            props.setDocumentName(documentName)
                            props.setVisible(false)
                        }} />
                </ModalViewButton>
            </ModalView>
        </ModalFullscreen>
    )
}
