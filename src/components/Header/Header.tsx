import type { ReactNode } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import type { TextInput, TextInputSubmitEditingEvent } from 'react-native'
import { Appbar } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useBlurInputOnKeyboardDismiss } from '@hooks'
import { HeaderInput } from './HeaderInput.tsx'
import type { MenuItems } from './HeaderMenu.tsx'
import { HeaderMenu } from './HeaderMenu.tsx'


export enum HeaderTitleMode {
  TEXT = 'TEXT',
  INPUT = 'INPUT',
}


interface HeaderProps {
  onGoBack?: () => void

  titleMode?: HeaderTitleMode
  initialTitle?: string
  title?: string
  inputTitlePlaceholder?: string
  onChangeTitle?: (newTitle: string) => void
  onSubmitTitle?: (title: string) => void

  isSelectionMode?: boolean
  onExitSelection?: () => void

  RightComponent?: ReactNode
  RightComponentSelectionMode?: ReactNode

  menuItems?: MenuItems
  menuItemsSelectionMode?: MenuItems
}


export function Header(props: HeaderProps) {


  const safeAreaInsets = useSafeAreaInsets()

  const inputTitleRef = useRef<TextInput>(null)


  useBlurInputOnKeyboardDismiss(inputTitleRef)


  const LeftComponent = useMemo(() => {
    if (props.isSelectionMode) {
      return (
        <Appbar.Action
          icon={'close'}
          onPress={props.onExitSelection}
        />
      )
    }

    if (props.onGoBack) {
      return (
        <Appbar.BackAction
          onPress={props.onGoBack}
        />
      )
    }

    return null
  }, [
    props.isSelectionMode,
    props.onExitSelection,
    props.onGoBack,
  ])


  const onSubmitTitle = useCallback((e: TextInputSubmitEditingEvent) => {
    const title = e.nativeEvent.text
    props.onSubmitTitle?.(title)
  }, [props.onSubmitTitle])

  const TitleComponent = useMemo(() => {
    if (props.titleMode === HeaderTitleMode.INPUT) {
      return (
        <HeaderInput
          ref={inputTitleRef}
          defaultValue={props.initialTitle}
          value={props.title}
          onChangeText={props.onChangeTitle}
          placeholder={props.inputTitlePlaceholder}
          onSubmitEditing={onSubmitTitle}
          autoCapitalize={'sentences'}
          returnKeyType={'done'}
        />
      )
    }

    return <Appbar.Content title={props.title} />
  }, [
    props.titleMode,
    props.initialTitle,
    props.title,
    props.onChangeTitle,
    props.inputTitlePlaceholder,
    onSubmitTitle,
  ])


  const RightComponent = useMemo((): ReactNode => {
    if (props.isSelectionMode && props.RightComponentSelectionMode) {
      return props.RightComponentSelectionMode
    }

    if (props.RightComponent) {
      return props.RightComponent
    }

    return null
  }, [
    props.isSelectionMode,
    props.RightComponentSelectionMode,
    props.RightComponent,
  ])


  return (
    <Appbar.Header
      elevated={true}
      statusBarHeight={safeAreaInsets.top}
    >
      {LeftComponent}

      {TitleComponent}

      {RightComponent}

      <HeaderMenu
        isSelectionMode={props.isSelectionMode}
        menuItems={props.menuItems}
        menuItemsSelectionMode={props.menuItemsSelectionMode}
      />
    </Appbar.Header>
  )
}
