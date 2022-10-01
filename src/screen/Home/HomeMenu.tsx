import { useRef } from "react"
import { RectButton } from "react-native-gesture-handler"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"

import { HeaderButton, MenuItem } from "../../components"


export interface HomeMenuProps {
    isSelectionMode: boolean;
    importDocument: () => void;
    exportDocument: () => void;
    openSettings: () => void;
    mergeDocument: () => void;
    duplicateDocument: () => void;
}


export function HomeMenu(props: HomeMenuProps) {


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
                {!props.isSelectionMode && (
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

                {props.isSelectionMode && (
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
