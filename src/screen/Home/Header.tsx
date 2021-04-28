import React, { Component } from "react"

import { BlockCenter, BlockLeft, BlockRight, Header, HeaderButton, HeaderTitle } from "../../component/Header"
import { appFName } from "../../service/constant"
import { HomeMenu } from "./HomeMenu"


export interface HomeHeaderProps {
    selectionMode: boolean,
    exitSelectionMode: () => void,
    deleteSelectedDocument: () => void,
    scanNewDocument: () => void,
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

                {this.props.selectionMode && (
                    <BlockRight>
                        <HeaderButton
                            iconName={"md-trash-outline"}
                            onPress={this.props.deleteSelectedDocument}
                        />
                    </BlockRight>
                )}

                {!this.props.selectionMode && (
                    <BlockRight>
                        <HeaderButton
                            iconName={"md-add"}
                            iconSize={30}
                            onPress={this.props.scanNewDocument}
                        />

                        <HomeMenu
                            openSettings={this.props.openSettings}
                            switchDebugHome={this.props.switchDebugHome}
                        />
                    </BlockRight>
                )}
            </Header>
        )
    }
}
