import React, { Component } from "react"

import { HomeMenu } from "./HomeMenu"
import { Header, HeaderButton, HeaderTitle } from "../../component"
import { appName } from "../../service/constant"


export interface HomeHeaderProps {
    selectionMode: boolean,
    exitSelectionMode: () => void,
    deleteSelectedDocument: () => void,
    scanNewDocument: () => void,
    importDocument: () => void,
    exportDocument: () => void,
    openSettings: () => void,
    switchDebugHome: () => void,
    mergeDocument: () => void,
    duplicateDocument: () => void,
}


export class HomeHeader extends Component<HomeHeaderProps> {


    constructor(props: HomeHeaderProps) {
        super(props)
    }


    shouldComponentUpdate(nextProps: HomeHeaderProps) {
        if (this.props.selectionMode !== nextProps.selectionMode) {
            return true
        } else if (this.props.switchDebugHome !== nextProps.switchDebugHome) {
            return true
        }
        return false
    }


    render() {
        return (
            <Header>
                {this.props.selectionMode && (
                    <HeaderButton
                        icon={"close"}
                        onPress={this.props.exitSelectionMode}
                    />
                )}

                {!this.props.selectionMode && (
                    <HeaderTitle title={appName} />
                )}

                {this.props.selectionMode && (
                    <HeaderTitle />
                )}

                {this.props.selectionMode && (
                    <HeaderButton
                        icon={"delete"}
                        onPress={this.props.deleteSelectedDocument}
                    />
                )}

                {!this.props.selectionMode && (
                    <HeaderButton
                        icon={"add"}
                        onPress={this.props.scanNewDocument}
                    />
                )}

                <HomeMenu
                    selectionMode={this.props.selectionMode}
                    importDocument={this.props.importDocument}
                    exportDocument={this.props.exportDocument}
                    openSettings={this.props.openSettings}
                    switchDebugHome={this.props.switchDebugHome}
                    mergeDocument={this.props.mergeDocument}
                    duplicateDocument={this.props.duplicateDocument}
                />
            </Header>
        )
    }
}
