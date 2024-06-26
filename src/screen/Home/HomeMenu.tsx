import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { StatusBar } from "react-native"
import { Appbar, Menu } from "react-native-paper"

import { translate } from "@locales"
import { NavigationParamProps } from "@router"


export interface HomeMenuProps {
    isSelectionMode: boolean
    importDocument: () => void
    exportDocument: () => void
    mergeDocument: () => void
    duplicateDocument: () => void
}


export function HomeMenu(props: HomeMenuProps) {


    const navigation = useNavigation<NavigationParamProps<"Home">>()

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
            {!props.isSelectionMode && <>
                <Menu.Item
                    title={translate("Home_menu_importDocument")}
                    onPress={() => {
                        setIsOpen(false)
                        props.importDocument()
                    }}
                />

                <Menu.Item
                    title={translate("Home_menu_exportDocument")}
                    onPress={() => {
                        setIsOpen(false)
                        props.exportDocument()
                    }}
                />

                <Menu.Item
                    title={translate("Home_menu_settings")}
                    onPress={() => {
                        setIsOpen(false)
                        navigation.navigate("Settings")
                    }}
                />
            </>}

            {props.isSelectionMode && <>
                <Menu.Item
                    title={translate("Home_menu_exportDocument")}
                    onPress={() => {
                        setIsOpen(false)
                        props.exportDocument()
                    }}
                />

                <Menu.Item
                    title={translate("Home_menu_mergeDocument")}
                    onPress={() => {
                        setIsOpen(false)
                        props.mergeDocument()
                    }}
                />

                <Menu.Item
                    title={translate("Home_menu_duplicateDocument")}
                    onPress={() => {
                        setIsOpen(false)
                        props.duplicateDocument()
                    }}
                />
            </>}
        </Menu>
    )
}
