import { useCallback, useMemo } from "react"
import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Checkbox, List } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"
import { scheduleOnRN } from "react-native-worklets"

import { DocumentDTO } from "@database"
import { StandardDateFormatter } from "@libs/date-formatter"
import { useAppTheme } from "@theme"


export * from "./constants"


const dateFormatter = new StandardDateFormatter()


interface DocumentItemProps extends SelectableItem {
  document: DocumentDTO
}


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
    dateFormatter.getLocaleDateTime(props.document.updatedAt)
  ), [props.document.updatedAt])


  const longPressGesture = Gesture.LongPress()
    .maxDistance(30)
    .minDuration(400)
    .onStart(event => scheduleOnRN(onLongPress))


  const SelectionCheckbox = useCallback(() => {
    if (!props.isSelectionMode) {
      return null
    }

    return (
      <Checkbox
        status={props.isSelected ? "checked" : "unchecked"}
        color={colors.primary}
        uncheckedColor={colors.onSurfaceVariant}
        onPress={onPress}
      />
    )
  }, [props.isSelectionMode, props.isSelected, onPress, colors.primary, colors.onSurfaceVariant])


  return (
    <GestureDetector gesture={longPressGesture}>
      <List.Item
        title={props.document.name}
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
