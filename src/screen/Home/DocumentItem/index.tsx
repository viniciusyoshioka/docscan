import { Color, Prisma } from "@elementium/color"
import { Text } from "@elementium/native"
import CheckBox from "@react-native-community/checkbox"
import { useMemo } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { LongPressGestureHandler } from "react-native-gesture-handler"

import { DocumentSchema } from "@database"
import { SelectableItem, useSelectableItem } from "@hooks"
import { DateService } from "@services/date"
import { useAppTheme } from "@theme"


export const DOCUMENT_ITEM_HEIGHT = 64


export interface DocumentItemProps extends SelectableItem {
    document: DocumentSchema;
}


export function DocumentItem(props: DocumentItemProps) {


    const { color, state } = useAppTheme()

    const { onPress, onLongPress } = useSelectableItem(props)


    const rippleColor = useMemo(() => {
        const backgroundColor = new Color(color.surface)
        const overlayColor = new Color(color.onSurface).setA(state.container.pressed)
        return Prisma.addColors(backgroundColor, overlayColor).toRgba()
    }, [color.surface, color.onSurface, state.container.pressed])


    return (
        <LongPressGestureHandler
            maxDist={30}
            minDurationMs={400}
            onHandlerStateChange={({ nativeEvent }) => onLongPress(nativeEvent)}
        >
            <Pressable
                onPress={onPress}
                android_ripple={{ color: rippleColor }}
                style={[styles.button, { backgroundColor: color.surface } ]}
            >
                <View style={styles.block}>
                    <Text
                        variant={"body"}
                        size={"large"}
                        numberOfLines={1}
                        style={{ color: color.onSurface, flex: 1, textAlignVertical: "center" }}
                        children={props.document.name}
                    />

                    <Text
                        variant={"body"}
                        size={"small"}
                        numberOfLines={1}
                        style={{ color: color.onSurfaceVariant, flex: 1, textAlignVertical: "center" }}
                        children={DateService.getLocaleDateTime(new Date(props.document.modifiedAt), false)}
                    />
                </View>

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
            </Pressable>
        </LongPressGestureHandler>
    )
}


const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        height: DOCUMENT_ITEM_HEIGHT,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    block: {
        flex: 1,
    }
})
