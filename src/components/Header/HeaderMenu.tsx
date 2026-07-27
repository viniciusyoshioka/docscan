import { useCallback, useMemo, useState } from 'react'
import { StatusBar } from 'react-native'
import { Appbar, Divider, Menu } from 'react-native-paper'


export interface MenuItem {
  iconName?: string
  title?: string
  onPress?: () => void
}

export type MenuItems = Array<MenuItem | null>


interface HeaderMenuProps {
  isSelectionMode?: boolean
  menuItems?: MenuItems
  menuItemsSelectionMode?: MenuItems
}


export function HeaderMenu(props: HeaderMenuProps) {


  const [isMenuOpen, setIsMenuOpen] = useState(false)


  const openMenu = useCallback(() => {
    setIsMenuOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])


  const MenuAnchor = useMemo(() => {
    return (
      <Appbar.Action
        icon={'dots-vertical'}
        onPress={openMenu}
      />
    )
  }, [openMenu])


  const MenuItem = useCallback(
    (menuItemProps: { menuItem: MenuItem | null }) => {
      const { menuItem } = menuItemProps

      if (menuItem === null) {
        return <Divider />
      }

      return (
        <Menu.Item
          leadingIcon={menuItem.iconName}
          title={menuItem.title}
          onPress={() => {
            closeMenu()
            menuItem.onPress?.()
          }}
        />
      )
    },
    [closeMenu],
  )


  const MenuItemsList = useMemo(() => {
    if (!props.menuItems?.length) {
      return null
    }

    return (
      <>
        {props.menuItems.map((menuItem, index) => (
          <MenuItem key={index} menuItem={menuItem} />
        ))}
      </>
    )
  }, [props.menuItems, MenuItem])

  const MenuItemsSelectionModeList = useMemo(() => {
    if (!props.menuItemsSelectionMode?.length) {
      return null
    }

    return (
      <>
        {props.menuItemsSelectionMode.map((menuItem, index) => (
          <MenuItem key={index} menuItem={menuItem} />
        ))}
      </>
    )
  }, [props.menuItemsSelectionMode, MenuItem])


  if (props.isSelectionMode && props.menuItemsSelectionMode?.length) {
    return (
      <Menu
        anchor={MenuAnchor}
        visible={isMenuOpen}
        onDismiss={closeMenu}
        statusBarHeight={StatusBar.currentHeight}
      >
        {MenuItemsSelectionModeList}
      </Menu>
    )
  }

  if (!props.isSelectionMode && props.menuItems?.length) {
    return (
      <Menu
        anchor={MenuAnchor}
        visible={isMenuOpen}
        onDismiss={closeMenu}
        statusBarHeight={StatusBar.currentHeight}
      >
        {MenuItemsList}
      </Menu>
    )
  }

  return null
}
