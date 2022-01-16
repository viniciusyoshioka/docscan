import React, { ReactNode, useCallback } from "react"
import { Modal as RNModal, ModalProps as RNModalProps, TouchableOpacity } from "react-native"

import { ModalBackground, ModalContent, ModalView } from "./style"


export interface ModalCameraSettingsProps extends RNModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onClose?: () => void;
    children?: ReactNode;
}


export function ModalCameraSettings(props: ModalCameraSettingsProps) {


    const closeModal = useCallback(() => {
        if (props.onClose) {
            props.onClose()
        }
        props.setVisible(false)
    }, [])


    return (
        <RNModal transparent={true} visible={props.visible} onRequestClose={closeModal}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeModal}>
                <ModalView>
                    <ModalBackground activeOpacity={1}>
                        <ModalContent>
                            {props?.children}
                        </ModalContent>
                    </ModalBackground>
                </ModalView>
            </TouchableOpacity>
        </RNModal>
    )
}
