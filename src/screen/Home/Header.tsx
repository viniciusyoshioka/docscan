import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"
import { appName } from "../../services/constant"
import { HomeMenu } from "./HomeMenu"


export interface HomeHeaderProps {
    selectionMode: boolean;
    exitSelectionMode: () => void;
    deleteSelectedDocument: () => void;
    scanNewDocument: () => void;
    importDocument: () => void;
    exportDocument: () => void;
    openSettings: () => void;
    mergeDocument: () => void;
    duplicateDocument: () => void;
}


export function HomeHeader(props: HomeHeaderProps) {
    return (
        <Header>
            {props.selectionMode && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitSelectionMode}
                />
            )}

            {!props.selectionMode && (
                <HeaderTitle title={appName} />
            )}

            {props.selectionMode && (
                <HeaderTitle />
            )}

            {props.selectionMode && (
                <HeaderButton
                    iconName={"delete"}
                    onPress={props.deleteSelectedDocument}
                />
            )}

            {!props.selectionMode && (
                <HeaderButton
                    iconName={"add"}
                    onPress={props.scanNewDocument}
                />
            )}

            <HomeMenu
                selectionMode={props.selectionMode}
                importDocument={props.importDocument}
                exportDocument={props.exportDocument}
                openSettings={props.openSettings}
                mergeDocument={props.mergeDocument}
                duplicateDocument={props.duplicateDocument}
            />
        </Header>
    )
}
