import { AnimatedHeader, AnimatedHeaderRef, HeaderButton, HeaderTitle } from "@elementium/native"
import { ForwardedRef, forwardRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "../../locales"
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


export const HomeHeader = forwardRef((props: HomeHeaderProps, ref: ForwardedRef<AnimatedHeaderRef>) => {


    const safeAreaInsets = useSafeAreaInsets()


    function getTitle(): string {
        if (props.isSelectionMode) {
            return props.selectedDocumentsAmount.toString()
        }
        return translate("Home_header_title")
    }


    return (
        <AnimatedHeader ref={ref} overrideStatusBar={safeAreaInsets.top !== 0}>
            {props.isSelectionMode && (
                <HeaderButton
                    iconName={"close"}
                    onPress={props.exitSelectionMode}
                />
            )}

            <HeaderTitle title={getTitle()} />

            {!props.isSelectionMode && (
                <HeaderButton
                    iconName={"add"}
                    onPress={props.scanNewDocument}
                />
            )}

            {props.isSelectionMode && <>
                <HeaderButton
                    iconName={"swap-horiz"}
                    onPress={props.invertSelection}
                />

                <HeaderButton
                    iconName={"delete"}
                    onPress={props.deleteSelectedDocuments}
                />
            </>}

            <HomeMenu
                isSelectionMode={props.isSelectionMode}
                importDocument={props.importDocument}
                exportDocument={props.exportDocument}
                openSettings={props.openSettings}
                mergeDocument={props.mergeDocument}
                duplicateDocument={props.duplicateDocument}
            />
        </AnimatedHeader>
    )
})
