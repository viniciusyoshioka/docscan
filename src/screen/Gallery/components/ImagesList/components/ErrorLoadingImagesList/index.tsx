import Color from "color"
import { View } from "react-native"
import { Button, Icon, Text } from "react-native-paper"
import { useStyles } from "react-native-unistyles"

import { translate } from "@locales"
import { useAppTheme } from "@theme"
import { stylesheet } from "./styles"


interface ErrorLoadingImagesListProps {
  loadImages: () => Promise<void>
}


export function ErrorLoadingImagesList(props: ErrorLoadingImagesListProps) {


  const { styles } = useStyles(stylesheet)

  const { colors, state } = useAppTheme()

  const rippleColor = Color(colors.onErrorContainer)
    .alpha(state.press)
    .rgb()
    .toString()


  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <View style={styles.titleContainer}>
          <Icon
            source={"alert-circle-outline"}
            size={24}
            color={colors.onErrorContainer}
          />

          <Text variant={"titleMedium"} style={styles.title}>
            {translate("Gallery_errorLoadingImages_title")}
          </Text>
        </View>

        <Text variant={"bodyLarge"} style={styles.text}>
          {translate("Gallery_errorLoadingImages_text")}
        </Text>

        <Button mode={"text"} rippleColor={rippleColor} onPress={props.loadImages}>
          <Text variant={"bodyLarge"} style={styles.text}>
            {translate("Gallery_errorLoadingImages_tryAgain")}
          </Text>
        </Button>
      </View>
    </View>
  )
}
