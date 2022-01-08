import React, { useRef } from "react"
import { BackHandler } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"

import { HeaderButton, MenuItem } from "../../components"


export interface EditDocumentMenuProps {
    convertToPdf: () => void,
    shareDocument: () => void,
    visualizePdf: () => void,
    renameDocument: () => void,
    deletePdf: () => void,
    deleteDocument: () => void,
}


export function EditDocumentMenu(props: EditDocumentMenuProps) {


    const menuRef = useRef<Menu>(null)


    function backhandlerFunction() {
        if (menuRef.current?.isOpen()) {
            menuRef.current?.close()
            return true
        }
        return false
    }

    function setBackhandler() {
        BackHandler.addEventListener(
            "hardwareBackPress",
            backhandlerFunction
        )
    }

    function removeBackhandler() {
        BackHandler.removeEventListener(
            "hardwareBackPress",
            backhandlerFunction
        )
    }


    return (
        <Menu ref={menuRef} onClose={removeBackhandler} onOpen={setBackhandler}>
            <MenuTrigger customStyles={{ TriggerTouchableComponent: RectButton }}>
                <HeaderButton
                    icon={"more-vert"}
                    onPress={() => menuRef.current?.open()}
                />
            </MenuTrigger>

            <MenuOptions>
                <MenuItem
                    text={"Converter para PDF"}
                    onPress={() => {
                        menuRef.current?.close()
                        props.convertToPdf()
                    }}
                />

                <MenuItem
                    text={"Compartilhar PDF"}
                    onPress={() => {
                        menuRef.current?.close()
                        props.shareDocument()
                    }}
                />

                <MenuItem
                    text={"Visualizar PDF"}
                    onPress={() => {
                        menuRef.current?.close()
                        props.visualizePdf()
                    }}
                />

                <MenuItem
                    text={"Renomear"}
                    onPress={() => {
                        menuRef.current?.close()
                        props.renameDocument()
                    }}
                />

                <MenuItem
                    text={"Apagar PDF"}
                    onPress={() => {
                        menuRef.current?.close()
                        props.deletePdf()
                    }}
                />

                <MenuItem
                    text={"Apagar documento"}
                    onPress={() => {
                        menuRef.current?.close()
                        props.deleteDocument()
                    }}
                />
            </MenuOptions>
        </Menu>
    )
}
