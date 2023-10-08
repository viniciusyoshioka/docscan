import { useState } from "react"
import { StatusBar } from "react-native"
import { Appbar, Menu } from "react-native-paper"

import { translate } from "@locales"


export interface EditDocumentMenuProps {
    convertToPdf: () => void;
    shareDocument: () => void;
    visualizePdf: () => void;
    renameDocument: () => void;
    deletePdf: () => void;
    deleteDocument: () => void;
}


export function EditDocumentMenu(props: EditDocumentMenuProps) {


    const [isOpen, setIsOpen] = useState(false)


    function MenuAnchor() {
        return (
            <Appbar.Action
                icon={"dots-vertical"}
                onPress={() => setIsOpen(true)}
            />
        )
    }


    return (
        <Menu
            anchor={<MenuAnchor />}
            visible={isOpen}
            onDismiss={() => setIsOpen(false)}
            statusBarHeight={StatusBar.currentHeight}
        >
            <Menu.Item
                title={translate("EditDocument_menu_convertToPdf")}
                onPress={() => {
                    setIsOpen(false)
                    props.convertToPdf()
                }}
            />

            <Menu.Item
                title={translate("EditDocument_menu_sharePdf")}
                onPress={() => {
                    setIsOpen(false)
                    props.shareDocument()
                }}
            />

            <Menu.Item
                title={translate("EditDocument_menu_visualizePdf")}
                onPress={() => {
                    setIsOpen(false)
                    props.visualizePdf()
                }}
            />

            <Menu.Item
                title={translate("EditDocument_menu_rename")}
                onPress={() => {
                    setIsOpen(false)
                    props.renameDocument()
                }}
            />

            <Menu.Item
                title={translate("EditDocument_menu_deletePdf")}
                onPress={() => {
                    setIsOpen(false)
                    props.deletePdf()
                }}
            />

            <Menu.Item
                title={translate("EditDocument_menu_deleteDocument")}
                onPress={() => {
                    setIsOpen(false)
                    props.deleteDocument()
                }}
            />
        </Menu>
    )
}
