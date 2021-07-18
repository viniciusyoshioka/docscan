import React, { useCallback, useRef } from "react"
import { BackHandler } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"

import { HeaderButton, MenuItem } from "../../component"
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
                    icon={"more-vert"}
                    onPress={() => menuRef.current?.open()}
                />
            </MenuTrigger>

            <MenuOptions>
                {!props.selectionMode && (
                    <MenuItem
                        text={"Importar Documento"}
                        onPress={() => {
                            menuRef.current?.close()
                            props.importDocument()
                        }}
                    />
                )}

                <MenuItem
                    text={"Exportar Documento"}
                    onPress={() => {
                        menuRef.current?.close()
                        props.exportDocument()
                    }}
                />

                {!props.selectionMode && (
                    <>
                        <MenuItem
                            text={"Configurações"}
                            onPress={() => {
                                menuRef.current?.close()
                                props.openSettings()
                            }}
                        />

                        {appInDevelopment && (
                            <MenuItem
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
