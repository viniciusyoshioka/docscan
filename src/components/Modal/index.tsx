import React from "react"
import { Modal as RNModal, ModalProps as RNModalProps, StyleProp, ViewStyle } from "react-native"

import { ModalContent, ModalView } from "./style"


export interface ModalProps extends RNModalProps {
    popupStyle?: StyleProp<ViewStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
}


export function Modal(props: ModalProps) {


    function closeModal() {
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
