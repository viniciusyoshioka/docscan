import React from "react"
import { Keyboard, Modal as RNModal, ModalProps as RNModalProps, StyleProp, ViewStyle } from "react-native"

import { ModalContent, ModalView } from "./style"


export interface ModalProps extends RNModalProps {
    popupStyle?: StyleProp<ViewStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
}


export const Modal = (props: ModalProps) => {


    function closeModal() {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss()
            return
        }

        if (props.onRequestClose) {
            props.onRequestClose()
        }
    }


    return (
        <RNModal transparent={true} visible={props.visible} onRequestClose={closeModal}>
            <ModalView
                activeOpacity={1}
                onPress={closeModal}
                style={props.backgroundStyle}
            >
                <ModalContent activeOpacity={1} style={props.popupStyle}>
                    {props.children}
                </ModalContent>
            </ModalView>
        </RNModal>
    )
}
