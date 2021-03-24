import React from "react"

import { BlockCenter, BlockRight, Header, HeaderButton, HeaderTitle } from "../../component/Header"
import HomeMenu from "./HomeMenu"


export interface HomeHeaderProps {
    selectionMode: boolean,
    deleteSelectedDocument: () => void,
    scanNewDocument: () => void,
    openSettings: () => void,
    switchDebugHome: () => void,
}


export default function HomeHeader(props: HomeHeaderProps) {
    return (
        <Header>
            <BlockCenter>
                <HeaderTitle>
                    DocScan
                </HeaderTitle>
            </BlockCenter>

            <BlockRight>
                <HeaderButton
                    iconName={"md-trash-outline"}
                    onPress={props.deleteSelectedDocument}
                    style={{opacity: props.selectionMode ? 1 : 0}}
                />

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
        </Header>  
    )
}
