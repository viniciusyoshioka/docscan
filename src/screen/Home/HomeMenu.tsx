import React, { useCallback, useRef } from "react"
import { BackHandler } from "react-native"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"
import { RectButton } from "react-native-gesture-handler"

import { HeaderButton } from "../../component/Header"
import { PopupMenuButton } from "../../component/PopupMenuButton"
import { appInDevelopment } from "../../service/constant"


export interface HomeMenuProps {
    selectionMode: boolean,
    importDocument: () => void,
    exportDocument: () => void,
    openSettings: () => void,
    switchDebugHome: () => void,
}


export function HomeMenu(props: HomeMenuProps) {


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
            <MenuTrigger customStyles={{ TriggerTouchableComponent: RectButton }}>
                <HeaderButton
                    iconName={"md-ellipsis-vertical"}
                    iconSize={22}
                    onPress={() => menuRef.current?.open()}
                />
            </MenuTrigger>

            <MenuOptions>
                {!props.selectionMode && (
                    <PopupMenuButton
                        text={"Importar Documento"}
                        onPress={() => {
                            menuRef.current?.close()
                            props.importDocument()
                        }}
                    />
                )}

                <PopupMenuButton
                    text={"Exportar Documento"}
                    onPress={() => {
                        menuRef.current?.close()
                        props.exportDocument()
                    }}
                />

                {!props.selectionMode && (
                    <>
                        <PopupMenuButton
                            text={"Configurações"}
                            onPress={() => {
                                menuRef.current?.close()
                                props.openSettings()
                            }}
                        />

                        {appInDevelopment && (
                            <PopupMenuButton
                                text={"Debug Home"}
                                onPress={() => {
                                    menuRef.current?.close()
                                    props.switchDebugHome()
                                }}
                            />
                        )}
                    </>
                )}
            </MenuOptions>
        </Menu>
    )
}
