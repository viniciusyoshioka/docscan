import { ActivityIndicator, StyleProp, StyleSheet, ViewStyle } from "react-native"
import Reanimated from "react-native-reanimated"

import { useAppTheme } from "@theme"


export interface LoadingOverlayProps {
    style?: StyleProp<Reanimated.AnimateStyle<StyleProp<ViewStyle>>>;
}


export function LoadingOverlay(props: LoadingOverlayProps) {


    const { color } = useAppTheme()


    return (
        <Reanimated.View style={[styles.wrapper, props.style]}>
            <ActivityIndicator
                size={"large"}
                color={color.onBackground}
            />
        </Reanimated.View>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
})
