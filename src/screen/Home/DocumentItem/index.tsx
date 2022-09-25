import CheckBox from "@react-native-community/checkbox"
import React, { useEffect, useState } from "react"
import { HandlerStateChangeEventPayload, LongPressGestureHandler, LongPressGestureHandlerEventPayload, State } from "react-native-gesture-handler"

import { toDateTime } from "../../../services/date"
import { useColorTheme } from "../../../services/theme"
import { DocumentForList } from "../../../types"
import { DocumentItemBlock, DocumentItemButton, DocumentItemDate, DocumentItemTitle } from "./style"


export { DOCUMENT_PICTURE_HEIGHT } from "./style"


export interface DocumentItemProps {
    click: () => void;
    select: () => void;
    deselect: () => void;
    selectionMode: boolean;
    document: DocumentForList;
}


export const DocumentItem = (props: DocumentItemProps) => {


    const { color, opacity } = useColorTheme()

    const [isSelected, setIsSelected] = useState(false)


    function onNormalPress() {
        if (!props.selectionMode) {
            props.click()
        } else if (!isSelected) {
            props.select()
            setIsSelected(true)
        } else if (isSelected) {
            props.deselect()
            setIsSelected(false)
        }
    }

    function onLongPress(nativeEvent: Readonly<HandlerStateChangeEventPayload & LongPressGestureHandlerEventPayload>) {
        if (nativeEvent.state === State.ACTIVE) {
            if (!props.selectionMode) {
                props.select()
                setIsSelected(true)
            }
        }
    }


    useEffect(() => {
        if (!props.selectionMode && isSelected) {
            setIsSelected(false)
        }
    }, [props.selectionMode])


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

                {props.selectionMode && (
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
