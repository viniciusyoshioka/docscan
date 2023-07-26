import { ReactNode } from "react"
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native"

import { useAppTheme } from "../../../theme"
import { CAMERA_CONTROL_HEIGHT_WITH_CAMERA } from "../CameraControl"
import { CAMERA_SETTINGS_BUTTON_HEIGHT } from "./CameraSettingsButton"


export interface CameraSettingsModalProps {
    visible?: boolean;
    onRequestClose?: () => void;
    children?: ReactNode;
}


export function CameraSettingsModal(props: CameraSettingsModalProps) {


    const { shape } = useAppTheme()


    if (!props.visible) return null


    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={props.onRequestClose}
            style={styles.pseudoModal}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.modalBackground, { borderRadius: shape.medium } ]}
            >
                <ScrollView
                    fadingEdgeLength={32}
                    showsVerticalScrollIndicator={false}
                    style={styles.modalContent}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalContentWrapper}
                        children={props.children}
                    />
                </ScrollView>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    pseudoModal: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 16,
        zIndex: 1,
    },
    modalBackground: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: CAMERA_CONTROL_HEIGHT_WITH_CAMERA,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        maxHeight: 1.5 * CAMERA_SETTINGS_BUTTON_HEIGHT,
    },
    modalContentWrapper: {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})
