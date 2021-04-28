import React, { useCallback, useState } from "react"
import { LongPressGestureHandler, State } from "react-native-gesture-handler"
import CheckBox from "@react-native-community/checkbox"

import { Document } from "../../service/object-types"
import { useTheme } from "../../service/theme"
import { Block, Button, Date, Line, Title } from "./style"


export interface DocumentItemProps {
    click: () => void,
    select: () => void,
    deselect: () => void,
    selectionMode: boolean,
    document: Document,
}


export function DocumentItem(props: DocumentItemProps) {


    const { color } = useTheme()

    const [selected, setSelected] = useState(false)


    const normalPress = useCallback(() => {
        if (!props.selectionMode) {
            props.click()
        } else if (!selected) {
            props.select()
            setSelected(true)
        } else if (selected) {
            props.deselect()
            setSelected(false)
        }
    }, [props.selectionMode, selected, props.click])

    const longPress = useCallback((nativeEvent) => {
        if (nativeEvent.state === State.ACTIVE) {
            if (!props.selectionMode) {
                props.select()
                setSelected(true)
            }
        }
    }, [props.selectionMode])


    return (
        <LongPressGestureHandler 
            maxDist={30} 
            minDurationMs={500} 
            onHandlerStateChange={({ nativeEvent }) => longPress(nativeEvent)}
        >
            <Button onPress={normalPress}>
                {props.selectionMode && (
                    <Block style={{marginRight: 5}}>
                        <CheckBox 
                            value={selected}
                            onChange={normalPress}
                            tintColors={{
                                true: color.color,
                                false: color.color
                            }}
                        />
                    </Block>
                )}

                <Block style={{alignItems: "flex-start", flex: 1}}>
                    <Line>
                        <Title numberOfLines={1}>
                            {props.document.name}
                        </Title>
                    </Line>

                    <Line>
                        <Date numberOfLines={1}>
                            {props.document.lastModificationDate}
                        </Date>
                    </Line>
                </Block>
            </Button>
        </LongPressGestureHandler>
    )
}
