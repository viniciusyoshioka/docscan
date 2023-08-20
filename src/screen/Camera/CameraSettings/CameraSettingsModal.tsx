import { ReactNode } from "react"
import { ScrollView, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native"

import { useAppTheme } from "@theme"
import { CAMERA_SETTINGS_BUTTON_HEIGHT } from "./CameraSettingsButton"


export interface CameraSettingsModalProps {
    visible?: boolean;
    onRequestClose?: () => void;
    children?: ReactNode;
    scrimStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    contentWrapperStyle?: StyleProp<ViewStyle>;
}


export function CameraSettingsModal(props: CameraSettingsModalProps) {


    const { shape } = useAppTheme()


    if (!props.visible) return null


    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={props.onRequestClose}
            style={[styles.scrim, props.scrimStyle]}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.container, { borderRadius: shape.medium }, props.containerStyle]}
            >
                <ScrollView
                    fadingEdgeLength={32}
                    showsVerticalScrollIndicator={false}
                    style={[styles.content, props.contentStyle]}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.contentWrapper, props.contentWrapperStyle]}
                        children={props.children}
                    />
                </ScrollView>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    scrim: {
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
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
        maxHeight: 1.5 * CAMERA_SETTINGS_BUTTON_HEIGHT,
    },
    contentWrapper: {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})
