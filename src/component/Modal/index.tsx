import React, { ReactChild, useCallback } from "react"
import { Modal as RNModal, ModalProps as RNModalProps, StyleProp, ViewStyle, TouchableOpacity } from "react-native"

import { ModalBackground, ModalContent, ModalView } from "./style"


export interface ModalProps extends RNModalProps {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    onClose?: Function,
    children?: ReactChild,
    modalStyle?: StyleProp<ViewStyle>,
    backgroundStyle?: StyleProp<ViewStyle>,
}


export function Modal(props: ModalProps) {


    const closeModal = useCallback(() => {
        if (props.onClose) {
            props.onClose()
        }
        props.setVisible(false)
    }, [])


    return (
        <RNModal 
            transparent={true} 
            visible={props.visible} 
            onRequestClose={() => closeModal()}
        >
            <TouchableOpacity
                style={{flex: 1}}
                activeOpacity={1}
                onPress={() => closeModal()}
            >
                <ModalView style={props.modalStyle}>
                    <ModalBackground activeOpacity={1} style={props.backgroundStyle}>
                        <ModalContent>
                            {props?.children}
                        </ModalContent>
                    </ModalBackground>
                </ModalView>
            </TouchableOpacity>
        </RNModal>
    )
}
