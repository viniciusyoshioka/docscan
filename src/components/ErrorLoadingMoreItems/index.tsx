import Color from "color"
import { View } from "react-native"
import { Icon, Text } from "react-native-paper"
import { Pressable } from "react-native-paper-towel"
import { useStyles } from "react-native-unistyles"

import { translate } from "@locales"
import { useAppTheme } from "@theme"
import { stylesheet } from "./styles"


interface ErrorLoadingMoreItemsProps {
  title: string
  tryAgain: () => void
}


export function ErrorLoadingMoreItems(props: ErrorLoadingMoreItemsProps) {


  const { styles } = useStyles(stylesheet)

  const { colors, state } = useAppTheme()

  const rippleColor = Color(colors.onErrorContainer)
    .alpha(state.press)
    .rgb()
    .toString()


  return (
    <Pressable
      style={styles.button}
      android_ripple={{ color: rippleColor }}
      onPress={props.tryAgain}
    >
      <View style={styles.titleContainer}>
        <Icon
          source={"alert-circle-outline"}
          size={18}
          color={colors.onErrorContainer}
        />

        <Text variant={"bodyMedium"} style={styles.title}>
          {props.title}
        </Text>
      </View>

      <Text variant={"bodyMedium"} style={styles.text}>
        {translate("clickHereToTryAgain")}
      </Text>
    </Pressable>
  )
}
