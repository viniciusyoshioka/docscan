import { ActivityIndicator, View } from "react-native"
import { createStyleSheet, useStyles } from "react-native-unistyles"

import { useAppTheme } from "@theme"


export function LoadingIndicator() {


    const { styles } = useStyles(stylesheet)
    const { colors } = useAppTheme()


    return (
        <View style={styles.wrapper}>
            <ActivityIndicator
                size={"small"}
                color={colors.onBackground}
            />
        </View>
    )
}


const stylesheet = createStyleSheet(theme => ({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },
}))
