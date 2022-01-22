import React, { useRef } from "react"
import { BackHandler } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"

import { HeaderButton, MenuItem } from "../../components"


export interface HomeMenuProps {
    selectionMode: boolean;
    importDocument: () => void;
    exportDocument: () => void;
    openSettings: () => void;
    mergeDocument: () => void;
    duplicateDocument: () => void;
}


export const HomeMenu = (props: HomeMenuProps) => {


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
                    iconName={"more-vert"}
                    onPress={() => menuRef.current?.open()}
                />
            </MenuTrigger>

            <MenuOptions>
                {!props.selectionMode && (
                    <>
                        <MenuItem
                            text={"Importar Documento"}
                            onPress={() => {
                                menuRef.current?.close()
                                props.importDocument()
                            }}
                        />

                        <MenuItem
                            text={"Exportar Documento"}
                            onPress={() => {
                                menuRef.current?.close()
                                props.exportDocument()
                            }}
                        />

                        <MenuItem
                            text={"Configurações"}
                            onPress={() => {
                                menuRef.current?.close()
                                props.openSettings()
                            }}
                        />
                    </>
                )}

                {props.selectionMode && (
                    <>
                        <MenuItem
                            text={"Exportar Documento"}
                            onPress={() => {
                                menuRef.current?.close()
                                props.exportDocument()
                            }}
                        />

                        <MenuItem
                            text={"Combinar Documento"}
                            onPress={() => {
                                menuRef.current?.close()
                                props.mergeDocument()
                            }}
                        />

                        <MenuItem
                            text={"Duplicar Documento"}
                            onPress={() => {
                                menuRef.current?.close()
                                props.duplicateDocument()
                            }}
                        />
                    </>
                )}
            </MenuOptions>
        </Menu>
    )
}
