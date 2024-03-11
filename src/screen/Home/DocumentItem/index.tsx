import { useMaterialTheme } from "react-material-design-provider"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Checkbox, List } from "react-native-paper"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"

import { DocumentSchema } from "@database"
import { DateService } from "@services/date"


export const DOCUMENT_ITEM_HEIGHT = 64


export interface DocumentItemProps extends SelectableItem {
    document: DocumentSchema
}


export function DocumentItem(props: DocumentItemProps) {


    const { colors } = useMaterialTheme()
    const { onPress, onLongPress } = useSelectableItem(props)


    const longPressGesture = Gesture.LongPress()
        .maxDistance(30)
        .minDuration(400)
        .onStart(event => runOnJS(onLongPress)())


    const modifiedAt = new Date(props.document.modifiedAt)


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
                description={DateService.getLocaleDateTime(modifiedAt, false)}
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
