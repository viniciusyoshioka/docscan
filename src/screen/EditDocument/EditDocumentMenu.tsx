import React, { useCallback, useEffect, useRef } from "react"
import { BackHandler } from "react-native"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"
import { RectButton } from "react-native-gesture-handler"

import { HeaderButton } from "../../component/Header"
import { PopupMenuButton } from "../../component/PopupMenuButton"


export interface EditDocumentMenuProps {
    renameDocument: () => void,
    exportToPdf: () => void,
    discardDocument: () => void,
}


export default function EditDocumentMenu(props: EditDocumentMenuProps) {


    const menuRef = useRef<Menu>(null)


    const closeMenu = useCallback(() => {
        menuRef.current?.close()
    }, [menuRef])

    const backhandlerMenuFunction = useCallback(() => {
        if (menuRef.current?.isOpen()) {
            closeMenu()
            return true
        }
        return false
    }, [menuRef, closeMenu])

    const setBackhandlerMenu = useCallback(() => {
        BackHandler.addEventListener(
            "hardwareBackPress", 
            backhandlerMenuFunction
        )
    }, [backhandlerMenuFunction])

    const removeBackhandlerMenu = useCallback(() => [
        BackHandler.removeEventListener(
            "hardwareBackPress",
            backhandlerMenuFunction
        )
    ], [backhandlerMenuFunction])

    const openMenu = useCallback(() => {
        setBackhandlerMenu()
        menuRef.current?.open()
    }, [setBackhandlerMenu, menuRef])


    useEffect(() => {
        return () => {
            removeBackhandlerMenu()
        }
    }, [removeBackhandlerMenu])


    return (
        <Menu ref={menuRef}>
            <MenuTrigger customStyles={{TriggerTouchableComponent: RectButton}}>
                <HeaderButton 
                    iconName={"md-ellipsis-vertical"}
                    iconSize={22} 
                    onPress={() => openMenu()} />
            </MenuTrigger>

            <MenuOptions>
                <PopupMenuButton 
                    text={"Renomear"} 
                    onPress={() => {
                        closeMenu()
                        props.renameDocument()
                    }}
                />

                <PopupMenuButton 
                    text={"Exportar PDF"} 
                    onPress={() => {
                        closeMenu()
                        props.exportToPdf()
                    }}
                />

                <PopupMenuButton 
                    text={"Descartar"} 
                    onPress={() => {
                        closeMenu()
                        props.discardDocument()
                    }}
                />
            </MenuOptions>
        </Menu>
    )
}
