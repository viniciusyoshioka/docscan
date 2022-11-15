import React, { ReactNode } from "react"

import { PseudoModal } from "../../../../components"
import { ModalBackground, ModalContent, ModalView } from "./style"


export interface CameraSettingsModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onClose?: () => void;
    children?: ReactNode;
}


export function CameraSettingsModal(props: CameraSettingsModalProps) {


    function closeModal() {
        if (props.onClose) {
            props.onClose()
        }
        props.setVisible(false)
    }


    if (!props.visible) {
        return null
    }


    return (
        <PseudoModal>
            <ModalView activeOpacity={1} onPress={closeModal}>
                <ModalBackground activeOpacity={1}>
                    <ModalContent
                        fadingEdgeLength={16}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexWrap: "wrap",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {props.children}
                    </ModalContent>
                </ModalBackground>
            </ModalView>
        </PseudoModal>
    )
}
