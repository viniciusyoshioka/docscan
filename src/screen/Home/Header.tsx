import React, { Component } from "react"

import { BlockCenter, BlockLeft, BlockRight, Header, HeaderButton, HeaderTitle } from "../../component/Header"
import { appFName } from "../../service/constant"
import { HomeMenu } from "./HomeMenu"


export interface HomeHeaderProps {
    selectionMode: boolean,
    exitSelectionMode: () => void,
    deleteSelectedDocument: () => void,
    scanNewDocument: () => void,
    importDocument: () => void,
    exportDocument: () => void,
    openSettings: () => void,
    switchDebugHome: () => void,
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
                    <BlockLeft>
                        <HeaderButton
                            iconName={"md-close"}
                            onPress={this.props.exitSelectionMode}
                        />
                    </BlockLeft>
                )}

                {!this.props.selectionMode && (
                    <BlockCenter>
                        <HeaderTitle>
                            {appFName}
                        </HeaderTitle>
                    </BlockCenter>
                )}

                <BlockRight>
                    {this.props.selectionMode && (
                        <HeaderButton
                            iconName={"md-trash"}
                            onPress={this.props.deleteSelectedDocument}
                        />
                    )}

                    {!this.props.selectionMode && (
                        <HeaderButton
                            iconName={"md-add"}
                            iconSize={30}
                            onPress={this.props.scanNewDocument}
                        />
                    )}

                    <HomeMenu
                        selectionMode={this.props.selectionMode}
                        importDocument={this.props.importDocument}
                        exportDocument={this.props.exportDocument}
                        openSettings={this.props.openSettings}
                        switchDebugHome={this.props.switchDebugHome}
                    />
                </BlockRight>
            </Header>
        )
    }
}
