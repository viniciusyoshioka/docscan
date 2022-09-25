import CheckBox from "@react-native-community/checkbox"
import React, { useEffect, useState } from "react"
import { HandlerStateChangeEventPayload, LongPressGestureHandler, LongPressGestureHandlerEventPayload, State } from "react-native-gesture-handler"

import { toDateTime } from "../../../services/date"
import { useColorTheme } from "../../../services/theme"
import { DocumentForList } from "../../../types"
import { DocumentItemBlock, DocumentItemButton, DocumentItemDate, DocumentItemTitle } from "./style"


export { DOCUMENT_PICTURE_HEIGHT } from "./style"


export interface DocumentItemProps {
    onClick: () => void;
    onSelected: () => void;
    onDeselected: () => void;
    isSelectionMode: boolean;
    document: DocumentForList;
}


export const DocumentItem = (props: DocumentItemProps) => {


    const { color, opacity } = useColorTheme()

    const [isSelected, setIsSelected] = useState(false)


    function onNormalPress() {
        if (!props.isSelectionMode) {
            props.onClick()
        } else if (!isSelected) {
            props.onSelected()
            setIsSelected(true)
        } else if (isSelected) {
            props.onDeselected()
            setIsSelected(false)
        }
    }

    function onLongPress(nativeEvent: Readonly<HandlerStateChangeEventPayload & LongPressGestureHandlerEventPayload>) {
        if (nativeEvent.state === State.ACTIVE) {
            if (!props.isSelectionMode) {
                props.onSelected()
                setIsSelected(true)
            }
        }
    }


    useEffect(() => {
        if (!props.isSelectionMode && isSelected) {
            setIsSelected(false)
        }
    }, [props.isSelectionMode])


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onLongPress(nativeEvent)}
        >
            <DocumentItemButton rippleColor={color.documentItem_ripple} onPress={onNormalPress}>
                <DocumentItemBlock style={{ flex: 1 }}>
                    <DocumentItemTitle numberOfLines={1}>
                        {props.document.name}
                    </DocumentItemTitle>

                    <DocumentItemDate numberOfLines={1}>
                        {toDateTime(props.document.lastModificationTimestamp)}
                    </DocumentItemDate>
                </DocumentItemBlock>

                {props.isSelectionMode && (
                    <DocumentItemBlock style={{ paddingLeft: 16 }}>
                        <CheckBox
                            value={isSelected}
                            onChange={onNormalPress}
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
