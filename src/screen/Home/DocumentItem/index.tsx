import CheckBox from "@react-native-community/checkbox"
import React, { useCallback, useEffect, useState } from "react"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"

import { toDateTime } from "../../../services/date"
import { useColorTheme } from "../../../services/theme"
import { DocumentForList } from "../../../types"
import { Block, Button, Date, Title } from "./style"


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


    const onNormalPress = useCallback(() => {
        if (!props.selectionMode) {
            props.click()
        } else if (!isSelected) {
            props.select()
            setIsSelected(true)
        } else if (isSelected) {
            props.deselect()
            setIsSelected(false)
        }
    }, [props.selectionMode, isSelected, props.click])

    const onLongPress = useCallback((nativeEvent) => {
        if (nativeEvent.state === State.ACTIVE) {
            if (!props.selectionMode) {
                props.select()
                setIsSelected(true)
            }
        }
    }, [props.selectionMode])


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
            <Button rippleColor={color.documentItem_ripple} onPress={onNormalPress}>
                <Block style={{ flex: 1 }}>
                    <Title numberOfLines={1}>
                        {props.document.name}
                    </Title>

                    <Date numberOfLines={1}>
                        {toDateTime(props.document.lastModificationTimestamp)}
                    </Date>
                </Block>

                {props.selectionMode && (
                    <Block style={{ paddingLeft: 16 }}>
                        <CheckBox
                            value={isSelected}
                            onChange={onNormalPress}
                            tintColors={{
                                true: color.documentItem_selected_background,
                                false: color.documentItem_selected_color
                            }}
                            style={{ opacity: opacity.highEmphasis }}
                        />
                    </Block>
                )}
            </Button>
        </LongPressGestureHandler>
    )
}
