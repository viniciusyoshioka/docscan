import { Color, Prism } from "@elementium/color"
import CheckBox from "@react-native-community/checkbox"
import { useMemo } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Text } from "react-native-paper"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"

import { DocumentSchema } from "@database"
import { DateService } from "@services/date"
import { useAppTheme } from "@theme"


export const DOCUMENT_ITEM_HEIGHT = 64


export interface DocumentItemProps extends SelectableItem {
    document: DocumentSchema
}


export function DocumentItem(props: DocumentItemProps) {


    const { color, state } = useAppTheme()

    const { onPress, onLongPress } = useSelectableItem(props)


    const rippleColor = useMemo(() => {
        const backgroundColor = new Color(color.surface)
        const overlayColor = new Color(color.onSurface).setA(state.container.pressed)
        return Prism.addColors(backgroundColor, overlayColor).toRgba()
    }, [color.surface, color.onSurface, state.container.pressed])


    const longPressGesture = Gesture.LongPress()
        .maxDistance(30)
        .minDuration(400)
        .onStart(event => runOnJS(onLongPress)())


    return (
        <GestureDetector gesture={longPressGesture}>
            <Pressable
                onPress={onPress}
                android_ripple={{ color: rippleColor }}
                style={[styles.button, { backgroundColor: color.surface } ]}
            >
                <View style={styles.block}>
                    <Text
                        variant={"bodyLarge"}
                        numberOfLines={1}
                        style={{ color: color.onSurface, flex: 1, textAlignVertical: "center" }}
                        children={props.document.name}
                    />

                    <Text
                        variant={"bodySmall"}
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
        </GestureDetector>
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
