import React, { Component } from "react"

import { Header, HeaderButton, HeaderTitle } from "../../component"


export interface CameraHeaderProps {
    goBack: () => void,
    openSettings: () => void,
}


export class CameraHeader extends Component<CameraHeaderProps> {


    constructor(props: CameraHeaderProps) {
        super(props)
    }


    shouldComponentUpdate() {
        return false
    }


    render() {
        return (
            <Header
                style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    backgroundColor: "transparent"
                }}
            >
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
