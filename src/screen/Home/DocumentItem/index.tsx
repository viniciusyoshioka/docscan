import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Checkbox, List } from "react-native-paper"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"

import { DocumentRealmSchema } from "@database"
import { StandardDateFormatter } from "@lib/date-formatter"
import { useAppTheme } from "@theme"


export const DOCUMENT_ITEM_HEIGHT = 64


export interface DocumentItemProps extends SelectableItem {
  document: DocumentRealmSchema
}


export function DocumentItem(props: DocumentItemProps) {


  const { colors } = useAppTheme()
  const { onPress, onLongPress } = useSelectableItem(props)
  const dateFormatter = new StandardDateFormatter()


  const longPressGesture = Gesture.LongPress()
    .maxDistance(30)
    .minDuration(400)
    .onStart(event => runOnJS(onLongPress)())


  function SelectionCheckbok() {
    if (props.isSelectionMode) return (
      <Checkbox
        status={props.isSelected ? "checked" : "unchecked"}
        color={colors.primary}
        uncheckedColor={colors.onSurfaceVariant}
        onPress={onPress}
      />
    )
    return null
  }


  return (
    <GestureDetector gesture={longPressGesture}>
      <List.Item
        title={props.document.name}
        titleNumberOfLines={1}
        description={dateFormatter.getLocaleDateTime(props.document.updatedAt)}
        descriptionNumberOfLines={1}
        onPress={onPress}
        right={() => <SelectionCheckbok />}
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
