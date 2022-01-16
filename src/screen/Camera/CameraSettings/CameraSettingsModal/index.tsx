import React, { ReactNode } from "react"
import { Modal as RNModal, ModalProps as RNModalProps } from "react-native"

import { ModalBackground, ModalContent, ModalView } from "./style"


export interface CameraSettingsModalProps extends RNModalProps {
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


    return (
        <RNModal transparent={true} visible={props.visible} onRequestClose={closeModal}>
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
        </RNModal>
    )
}
