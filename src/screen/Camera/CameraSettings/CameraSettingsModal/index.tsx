import { ReactNode } from "react"

import { ModalBackground, ModalContent, PseudoModal } from "./style"


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
                    contentContainerStyle={{
                        flexWrap: "wrap",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    children={props.children}
                />
            </ModalBackground>
        </PseudoModal>
    )
}
