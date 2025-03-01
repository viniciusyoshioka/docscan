import { useCallback } from "react"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Checkbox, List } from "react-native-paper"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"

import { DocumentDTO } from "@database"
import { StandardDateFormatter } from "@libs/date-formatter"
import { useAppTheme } from "@theme"


export * from "./constants"


const dateFormatter = new StandardDateFormatter()


interface DocumentItemProps extends SelectableItem {
  document: DocumentDTO
}


export function DocumentItem(props: DocumentItemProps) {


  const { onPress, onLongPress } = useSelectableItem(props)

  const { colors } = useAppTheme()


  const longPressGesture = Gesture.LongPress()
    .maxDistance(30)
    .minDuration(400)
    .onStart(event => runOnJS(onLongPress)())


  const SelectionCheckbok = useCallback(() => {
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
        description={dateFormatter.getLocaleDateTime(props.document.updatedAt)}
        descriptionNumberOfLines={1}
        onPress={onPress}
        right={SelectionCheckbok}
        style={{
          paddingRight: props.isSelectionMode ? 8 : 16,
        }}
        titleStyle={{
          marginRight: props.isSelectionMode ? 8 : 0,
        }}
      />
    </GestureDetector>
  )
}
