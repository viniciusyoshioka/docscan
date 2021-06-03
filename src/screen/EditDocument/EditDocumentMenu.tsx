import React, { useCallback, useRef } from "react"
import { BackHandler } from "react-native"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"
import { RectButton } from "react-native-gesture-handler"

import { HeaderButton } from "../../component/Header"
import { PopupMenuButton } from "../../component/PopupMenuButton"


export interface EditDocumentMenuProps {
    convertToPdf: () => void,
    shareDocument: () => void,
    visualizePdf: () => void,
    renameDocument: () => void,
    discardDocument: () => void,
}


export function EditDocumentMenu(props: EditDocumentMenuProps) {


    const menuRef = useRef<Menu>(null)


    const backhandlerFunction = useCallback(() => {
        if (menuRef.current?.isOpen()) {
            menuRef.current?.close()
            return true
        }
        return false
    }, [menuRef])

    const setBackhandler = useCallback(() => {
        BackHandler.addEventListener(
            "hardwareBackPress",
            backhandlerFunction
        )
    }, [backhandlerFunction])

    const removeBackhandler = useCallback(() => {
        BackHandler.removeEventListener(
            "hardwareBackPress",
            backhandlerFunction
        )
    }, [backhandlerFunction])


    return (
        <Menu ref={menuRef} onClose={removeBackhandler} onOpen={setBackhandler}>
            <MenuTrigger customStyles={{TriggerTouchableComponent: RectButton}}>
                <HeaderButton 
                    iconName={"md-ellipsis-vertical"}
                    iconSize={22} 
                    onPress={() => menuRef.current?.open()}
                />
            </MenuTrigger>

            <MenuOptions>
                <PopupMenuButton 
                    text={"Converter para PDF"} 
                    onPress={() => {
                        menuRef.current?.close()
                        props.convertToPdf()
                    }}
                />

                <PopupMenuButton 
                    text={"Compartilhar PDF"} 
                    onPress={() => {
                        menuRef.current?.close()
                        props.shareDocument()
                    }}
                />

                <PopupMenuButton 
                    text={"Visualizar PDF"} 
                    onPress={() => {
                        menuRef.current?.close()
                        props.visualizePdf()
                    }}
                />

                <PopupMenuButton 
                    text={"Renomear"} 
                    onPress={() => {
                        menuRef.current?.close()
                        props.renameDocument()
                    }}
                />

                <PopupMenuButton 
                    text={"Descartar"} 
                    onPress={() => {
                        menuRef.current?.close()
                        props.discardDocument()
                    }}
                />
            </MenuOptions>
        </Menu>
    )
}
