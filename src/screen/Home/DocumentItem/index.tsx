import { Text } from "@elementium/native"
import CheckBox from "@react-native-community/checkbox"
import { LongPressGestureHandler } from "react-native-gesture-handler"

import { SelectableItem, useSelectableItem } from "../../../hooks"
import { getLocaleDateTime } from "../../../services/date"
import { useAppTheme } from "../../../theme"
import { DocumentForList } from "../../../types"
import { DocumentItemBlock, DocumentItemButton } from "./style"


export interface DocumentItemProps extends SelectableItem {
    document: DocumentForList;
}


export function DocumentItem(props: DocumentItemProps) {


    const { color } = useAppTheme()

    const { onPress, onLongPress } = useSelectableItem(props)


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onLongPress(nativeEvent)}
        >
            <DocumentItemButton onPress={onPress}>
                <DocumentItemBlock>
                    <Text
                        variant={"body"}
                        size={"large"}
                        numberOfLines={1}
                        style={{ color: color.onSurface }}
                        children={props.document.name}
                    />

                    <Text
                        variant={"body"}
                        size={"small"}
                        numberOfLines={1}
                        style={{ color: color.onSurfaceVariant }}
                        children={getLocaleDateTime(new Date(props.document.lastModificationTimestamp), "/", ":", false)}
                    />
                </DocumentItemBlock>

                {props.isSelectionMode && (
                    <CheckBox
                        value={props.isSelected}
                        onChange={onPress}
                        tintColors={{
                            true: color.primary,
                            false: color.onSurfaceVariant,
                        }}
                        style={{ marginLeft: 16 }}
                    />
                )}
            </DocumentItemButton>
        </LongPressGestureHandler>
    )
}
