import { useCallback, useMemo } from 'react'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { GestureDetector, useLongPressGesture } from 'react-native-gesture-handler'
import { Checkbox, List } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { SelectableItem } from 'react-native-selection-mode'
import { useSelectableItem } from 'react-native-selection-mode'
import { scheduleOnRN } from 'react-native-worklets'

import type { DocumentEntity } from '@database'
import { StandardDateFormatter } from '@modules/date-formatter'
import { useAppTheme } from '@theme'


const dateFormatter = new StandardDateFormatter()


interface DocumentItemProps extends SelectableItem<DocumentEntity> {}


export function DocumentItem(props: DocumentItemProps) {


  const safeAreaInsets = useSafeAreaInsets()
  const { onPress, onLongPress } = useSelectableItem(props)

  const { colors } = useAppTheme()


  const style = useMemo<StyleProp<ViewStyle>>(() => ({
    paddingLeft: safeAreaInsets.left,
    paddingRight: safeAreaInsets.right + (props.isSelectionMode ? 8 : 16),
  }), [safeAreaInsets.left, safeAreaInsets.right, props.isSelectionMode])

  const titleStyle = useMemo<StyleProp<TextStyle>>(() => ({
    marginRight: props.isSelectionMode ? 8 : 0,
  }), [props.isSelectionMode])

  const description = useMemo(() => (
    dateFormatter.getLocaleDateTime(props.item.updatedAt)
  ), [props.item.updatedAt])


  const longPressGesture = useLongPressGesture({
    maxDistance: 30,
    minDuration: 400,
    onBegin: event => scheduleOnRN(onLongPress),
  })


  const SelectionCheckbox = useCallback(() => {
    if (!props.isSelectionMode) {
      return null
    }

    return (
      <Checkbox
        status={props.isSelected ? 'checked' : 'unchecked'}
        color={colors.primary}
        uncheckedColor={colors.onSurfaceVariant}
        onPress={onPress}
      />
    )
  }, [
    props.isSelectionMode,
    props.isSelected,
    colors.primary,
    colors.onSurfaceVariant,
    onPress,
  ])


  return (
    <GestureDetector gesture={longPressGesture}>
      <List.Item
        title={props.item.title}
        titleNumberOfLines={1}
        description={description}
        descriptionNumberOfLines={1}
        onPress={onPress}
        right={SelectionCheckbox}
        style={style}
        titleStyle={titleStyle}
      />
    </GestureDetector>
  )
}
