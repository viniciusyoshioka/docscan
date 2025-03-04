import { useNavigation } from "@react-navigation/native"
import { useCallback, useMemo, useState } from "react"
import { StatusBar } from "react-native"
import { Appbar, Menu } from "react-native-paper"

import { translate } from "@locales"
import { NavigationProps } from "@router"


interface HomeHeaderMenuProps {
  isSelectionMode: boolean
  importDocuments: () => void
  exportDocuments: () => void
  mergeDocuments: () => void
  duplicateDocuments: () => void
}


export function HomeHeaderMenu(props: HomeHeaderMenuProps) {
  const {
    isSelectionMode,
    importDocuments,
    exportDocuments,
    mergeDocuments,
    duplicateDocuments,
  } = props


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

  const onPressImportDocuments = useCallback(() => {
    closeMenu()
    importDocuments()
  }, [closeMenu, importDocuments])

  const onPressExportDocuments = useCallback(() => {
    closeMenu()
    exportDocuments()
  }, [closeMenu, exportDocuments])

  const onPressMergeDocuments = useCallback(() => {
    closeMenu()
    mergeDocuments()
  }, [closeMenu, mergeDocuments])

  const onPressDuplicateDocuments = useCallback(() => {
    closeMenu()
    duplicateDocuments()
  }, [closeMenu, duplicateDocuments])

  const onPressOpenSettings = useCallback(() => {
    closeMenu()
    navigation.navigate("Settings")
  }, [closeMenu, navigation.navigate])


  if (isSelectionMode) return (
    <Menu
      anchor={MenuAnchor}
      visible={isOpen}
      onDismiss={closeMenu}
      statusBarHeight={StatusBar.currentHeight}
    >
      <Menu.Item
        leadingIcon={"tray-arrow-up"}
        title={translate("Home_menu_exportDocument")}
        onPress={onPressExportDocuments}
      />

      <Menu.Item
        leadingIcon={"vector-combine"}
        title={translate("Home_menu_mergeDocument")}
        onPress={onPressMergeDocuments}
      />

      <Menu.Item
        leadingIcon={"content-duplicate"}
        title={translate("Home_menu_duplicateDocument")}
        onPress={onPressDuplicateDocuments}
      />
    </Menu>
  )


  return (
    <Menu
      anchor={MenuAnchor}
      visible={isOpen}
      onDismiss={closeMenu}
      statusBarHeight={StatusBar.currentHeight}
    >
      <Menu.Item
        leadingIcon={"tray-arrow-down"}
        title={translate("Home_menu_importDocument")}
        onPress={onPressImportDocuments}
      />

      <Menu.Item
        leadingIcon={"tray-arrow-up"}
        title={translate("Home_menu_exportDocument")}
        onPress={onPressExportDocuments}
      />

      <Menu.Item
        leadingIcon={"cog-outline"}
        title={translate("Home_menu_settings")}
        onPress={onPressOpenSettings}
      />
    </Menu>
  )
}
