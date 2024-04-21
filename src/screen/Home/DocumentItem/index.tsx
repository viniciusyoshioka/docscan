import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { List } from "react-native-paper"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"

import { Document, WithId } from "@database"
import { StandardDateFormatter } from "@lib/date-formatter"
import { SelectionCheckbok } from "./SelectionCheckbox"


export const DOCUMENT_ITEM_HEIGHT = 64


export interface DocumentItemProps extends SelectableItem {
  document: WithId<Document>
}


export function DocumentItem(props: DocumentItemProps) {


  const { onPress, onLongPress } = useSelectableItem(props)
  const dateFormatter = new StandardDateFormatter()


  const longPressGesture = Gesture.LongPress()
    .maxDistance(30)
    .minDuration(400)
    .onStart(event => runOnJS(onLongPress)())


  return (
    <GestureDetector gesture={longPressGesture}>
      <List.Item
        title={props.document.name}
        titleNumberOfLines={1}
        description={dateFormatter.getLocaleDateTime(props.document.modifiedAt)}
        descriptionNumberOfLines={1}
        onPress={onPress}
        right={() => (
          <SelectionCheckbok
            isSelected={props.isSelected}
            isSelectionMode={props.isSelectionMode}
            onPress={onPress}
          />
        )}
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
