import { ReactNode } from "react"

import { ModalBackground, ModalContent, ModalContentWrapper, PseudoModal } from "./style"


export interface CameraSettingsModalProps {
    visible?: boolean;
    onRequestClose?: () => void;
    children?: ReactNode;
}


export function CameraSettingsModal(props: CameraSettingsModalProps) {


    if (!props.visible) {
        return null
    }


    return (
        <PseudoModal activeOpacity={1} onPress={props.onRequestClose}>
            <ModalBackground activeOpacity={1}>
                <ModalContent
                    fadingEdgeLength={32}
                    showsVerticalScrollIndicator={false}
                >
                    <ModalContentWrapper activeOpacity={1}>
                        {props.children}
                    </ModalContentWrapper>
                </ModalContent>
            </ModalBackground>
        </PseudoModal>
    )
}
