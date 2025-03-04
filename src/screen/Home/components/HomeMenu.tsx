import { useNavigation } from "@react-navigation/native"
import { useCallback, useMemo, useState } from "react"
import { StatusBar } from "react-native"
import { Appbar, Menu } from "react-native-paper"

import { translate } from "@locales"
import { NavigationProps } from "@router"


interface HomeMenuProps {
  isSelectionMode: boolean
  importDocument: () => void
  exportDocument: () => void
  mergeDocument: () => void
  duplicateDocument: () => void
}


export function HomeMenu(props: HomeMenuProps) {


  const navigation = useNavigation<NavigationProps<"Home">>()

  const [isOpen, setIsOpen] = useState(false)


  const MenuAnchor = useMemo(() => {
    return (
      <Appbar.Action
        icon={"dots-vertical"}
        onPress={() => setIsOpen(true)}
      />
    )
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])


  return (
    <Menu
      anchor={MenuAnchor}
      visible={isOpen}
      onDismiss={closeMenu}
      statusBarHeight={StatusBar.currentHeight}
    >
      {!props.isSelectionMode && (
        <>
          <Menu.Item
            leadingIcon={"tray-arrow-down"}
            title={translate("Home_menu_importDocument")}
            onPress={() => {
              closeMenu()
              props.importDocument()
            }}
          />

          <Menu.Item
            leadingIcon={"tray-arrow-up"}
            title={translate("Home_menu_exportDocument")}
            onPress={() => {
              closeMenu()
              props.exportDocument()
            }}
          />

          <Menu.Item
            leadingIcon={"cog-outline"}
            title={translate("Home_menu_settings")}
            onPress={() => {
              closeMenu()
              navigation.navigate("Settings")
            }}
          />
        </>
      )}

      {props.isSelectionMode && (
        <>
          <Menu.Item
            leadingIcon={"tray-arrow-up"}
            title={translate("Home_menu_exportDocument")}
            onPress={() => {
              closeMenu()
              props.exportDocument()
            }}
          />

          <Menu.Item
            leadingIcon={"vector-combine"}
            title={translate("Home_menu_mergeDocument")}
            onPress={() => {
              closeMenu()
              props.mergeDocument()
            }}
          />

          <Menu.Item
            leadingIcon={"content-duplicate"}
            title={translate("Home_menu_duplicateDocument")}
            onPress={() => {
              closeMenu()
              props.duplicateDocument()
            }}
          />
        </>
      )}
    </Menu>
  )
}
