import React, { Component } from "react"
import { StyleSheet } from "react-native"

import { Header, HeaderButton, HeaderTitle } from "../../components"


export interface CameraHeaderProps {
    goBack: () => void;
    openSettings: () => void;
    isLayoutPositionAbsolute: boolean;
}


export class CameraHeader extends Component<CameraHeaderProps> {


    constructor(props: CameraHeaderProps) {
        super(props)
    }


    shouldComponentUpdate(nextProps: CameraHeaderProps) {
        if (this.props.isLayoutPositionAbsolute !== nextProps.isLayoutPositionAbsolute) {
            return true
        }
        return false
    }


    render() {
        return (
            <Header style={this.props.isLayoutPositionAbsolute ? styles.absolute : styles.relative}>
                <HeaderButton
                    icon={"arrow-back"}
                    onPress={this.props.goBack}
                />

                <HeaderTitle />

                <HeaderButton
                    icon={"settings"}
                    onPress={this.props.openSettings}
                />
            </Header>
        )
    }
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
