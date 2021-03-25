import React from "react"

import { BlockCenter, BlockLeft, BlockRight, Header, HeaderButton, HeaderTitle } from "../../component/Header"
import HomeMenu from "./HomeMenu"


export interface HomeHeaderProps {
    selectionMode: boolean,
    exitSelectionMode: () => void,
    deleteSelectedDocument: () => void,
    scanNewDocument: () => void,
    openSettings: () => void,
    switchDebugHome: () => void,
}


export default function HomeHeader(props: HomeHeaderProps) {
    return (
        <Header>
            {props.selectionMode && (
                <BlockLeft>
                    <HeaderButton
                        iconName={"md-close"}
                        onPress={props.exitSelectionMode}
                    />
                </BlockLeft>
            )}

            {!props.selectionMode && (
                <BlockCenter>
                    <HeaderTitle>
                        DocScan
                    </HeaderTitle>
                </BlockCenter>
            )}

            {props.selectionMode && (
                <BlockRight>
                    <HeaderButton
                        iconName={"md-trash-outline"}
                        onPress={props.deleteSelectedDocument}
                        style={{opacity: props.selectionMode ? 1 : 0}}
                    />
                </BlockRight>
            )}

            {!props.selectionMode && (
                <BlockRight>
                    <HeaderButton
                        iconName={"md-add"}
                        iconSize={30}
                        onPress={props.scanNewDocument}
                    />

                    <HomeMenu
                        openSettings={props.openSettings}
                        switchDebugHome={props.switchDebugHome}
                    />
                </BlockRight>
            )}
        </Header>  
    )
}
