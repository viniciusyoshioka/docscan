import React from "react"

import { Header, HeaderButton, HeaderTitle } from "../../components"
import { appName } from "../../services/constant"
import { HomeMenu } from "./HomeMenu"


export interface HomeHeaderProps {
    isSelectionMode: boolean;
    selectedDocumentsAmount: number;
    exitSelectionMode: () => void;
    invertSelection: () => void;
    deleteSelectedDocuments: () => void;
    scanNewDocument: () => void;
    importDocument: () => void;
    exportDocument: () => void;
    openSettings: () => void;
    mergeDocument: () => void;
    duplicateDocument: () => void;
}


export function HomeHeader(props: HomeHeaderProps) {


    function getTitle() {
        if (props.isSelectionMode) {
            return props.selectedDocumentsAmount.toString()
        }
        return appName
    }


    return (
        <Header>
            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitSelectionMode}
                />
            )}

            <HeaderTitle title={getTitle()} />

            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"swap-horiz"}
                    onPress={props.invertSelection}
                />
            )}

            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"delete"}
                    onPress={props.deleteSelectedDocuments}
                />
            )}

            {!props.isSelectionMode && (
                <HeaderButton
                    iconName={"add"}
                    onPress={props.scanNewDocument}
                />
            )}

            <HomeMenu
                isSelectionMode={props.isSelectionMode}
                importDocument={props.importDocument}
                exportDocument={props.exportDocument}
                openSettings={props.openSettings}
                mergeDocument={props.mergeDocument}
                duplicateDocument={props.duplicateDocument}
            />
        </Header>
    )
}
