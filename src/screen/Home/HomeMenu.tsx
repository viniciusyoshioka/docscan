import { useRef } from "react"
import { RectButton } from "react-native-gesture-handler"
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu"

import { HeaderButton, MenuItem } from "../../components"
import { translate } from "../../locales"


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
                    <MenuItem
                        text={translate("Home_menu_importDocument")}
                        onPress={() => {
                            menuRef.current?.close()
                            props.importDocument()
                        }}
                    />
                )}

                <MenuItem
                    text={translate("Home_menu_exportDocument")}
                    onPress={() => {
                        menuRef.current?.close()
                        props.exportDocument()
                    }}
                />

                {!props.isSelectionMode && (
                    <MenuItem
                        text={translate("Home_menu_settings")}
                        onPress={() => {
                            menuRef.current?.close()
                            props.openSettings()
                        }}
                    />
                )}

                {props.isSelectionMode && (
                    <MenuItem
                        text={translate("Home_menu_mergeDocument")}
                        onPress={() => {
                            menuRef.current?.close()
                            props.mergeDocument()
                        }}
                    />
                )}

                {props.isSelectionMode && (
                    <MenuItem
                        text={translate("Home_menu_duplicateDocument")}
                        onPress={() => {
                            menuRef.current?.close()
                            props.duplicateDocument()
                        }}
                    />
                )}
            </MenuOptions>
        </Menu>
    )
}
