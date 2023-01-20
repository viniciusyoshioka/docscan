import CheckBox from "@react-native-community/checkbox"
import { LongPressGestureHandler } from "react-native-gesture-handler"

import { SelectableItem, useSelectableItem } from "../../../hooks"
import { getLocaleDateTime } from "../../../services/date"
import { useAppTheme } from "../../../services/theme"
import { DocumentForList } from "../../../types"
import { DocumentItemBlock, DocumentItemButton, DocumentItemDate, DocumentItemTitle } from "./style"


export { DOCUMENT_PICTURE_HEIGHT } from "./style"


export interface DocumentItemProps extends SelectableItem {
    document: DocumentForList;
}


export function DocumentItem(props: DocumentItemProps) {


    const { color, opacity } = useAppTheme()

    const { onPress, onLongPress } = useSelectableItem(props)


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onLongPress(nativeEvent)}
        >
            <DocumentItemButton rippleColor={color.documentItem_ripple} onPress={onPress}>
                <DocumentItemBlock style={{ flex: 1 }}>
                    <DocumentItemTitle numberOfLines={1}>
                        {props.document.name}
                    </DocumentItemTitle>

                    <DocumentItemDate numberOfLines={1}>
                        {getLocaleDateTime(new Date(props.document.lastModificationTimestamp), "/", ":", false)}
                    </DocumentItemDate>
                </DocumentItemBlock>

                {props.isSelectionMode && (
                    <DocumentItemBlock style={{ paddingLeft: 16 }}>
                        <CheckBox
                            value={props.isSelected}
                            onChange={onPress}
                            tintColors={{
                                true: color.documentItem_selected_background,
                                false: color.documentItem_selected_color
                            }}
                            style={{ opacity: opacity.highEmphasis }}
                        />
                    </DocumentItemBlock>
                )}
            </DocumentItemButton>
        </LongPressGestureHandler>
    )
}
