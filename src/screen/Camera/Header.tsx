import React from "react"
import { StyleSheet } from "react-native"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface CameraHeaderProps {
    goBack: () => void;
    openSettings: () => void;
    isLayoutPositionAbsolute: boolean;
}


export function CameraHeader(props: CameraHeaderProps) {
    return (
        <Header style={props.isLayoutPositionAbsolute ? styles.absolute : styles.relative}>
            <HeaderButton
                iconName={"arrow-back"}
                onPress={props.goBack}
            />

            <HeaderTitle />

            <HeaderButton
                iconName={"settings"}
                onPress={props.openSettings}
            />
        </Header>
    )
}


const styles = StyleSheet.create({
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
    },
    relative: {
        backgroundColor: "transparent",
    },
})
