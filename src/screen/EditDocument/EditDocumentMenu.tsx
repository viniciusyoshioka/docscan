import React, { useRef } from "react"
import { RectButton } from "react-native-gesture-handler"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"

import { HeaderButton, MenuItem } from "../../components"
import { translate } from "../../locales"


export interface EditDocumentMenuProps {
    convertToPdf: () => void;
    shareDocument: () => void;
    visualizePdf: () => void;
    renameDocument: () => void;
    deletePdf: () => void;
    deleteDocument: () => void;
}


export function EditDocumentMenu(props: EditDocumentMenuProps) {


    const menuRef = useRef<Menu>(null)


    return (
        <Menu ref={menuRef}>
            <MenuTrigger customStyles={{ TriggerTouchableComponent: RectButton }}>
                <HeaderButton
                    iconName={"more-vert"}
                    onPress={() => menuRef.current?.open()}
                />
            </MenuTrigger>

            <MenuOptions>
                <MenuItem
                    text={translate("EditDocument_menu_convertToPdf")}
                    onPress={() => {
                        menuRef.current?.close()
                        props.convertToPdf()
                    }}
                />

                <MenuItem
                    text={translate("EditDocument_menu_sharePdf")}
                    onPress={() => {
                        menuRef.current?.close()
                        props.shareDocument()
                    }}
                />

                <MenuItem
                    text={translate("EditDocument_menu_visualizePdf")}
                    onPress={() => {
                        menuRef.current?.close()
                        props.visualizePdf()
                    }}
                />

                <MenuItem
                    text={translate("EditDocument_menu_rename")}
                    onPress={() => {
                        menuRef.current?.close()
                        props.renameDocument()
                    }}
                />

                <MenuItem
                    text={translate("EditDocument_menu_deletePdf")}
                    onPress={() => {
                        menuRef.current?.close()
                        props.deletePdf()
                    }}
                />

                <MenuItem
                    text={translate("EditDocument_menu_deleteDocument")}
                    onPress={() => {
                        menuRef.current?.close()
                        props.deleteDocument()
                    }}
                />
            </MenuOptions>
        </Menu>
    )
}
