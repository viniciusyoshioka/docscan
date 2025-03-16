import { Linking, ScrollView, useWindowDimensions, View, ViewStyle } from "react-native"
import { Button, Text } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStyles } from "react-native-unistyles"

import { translate } from "@locales"
import { GALLERY_HEADER_HEIGHT } from "../../../GalleryHeader"
import { useRequestReadMediaImagesPermission } from "../../hooks"
import { stylesheet } from "./styles"


interface NoImagesListPermissionProps {}


export function NoImagesListPermission(props: NoImagesListPermissionProps) {


  const { height } = useWindowDimensions()
  const safeAreaInsets = useSafeAreaInsets()
  const { styles } = useStyles(stylesheet)

  const requestPermission = useRequestReadMediaImagesPermission()


  const scrollScreenContentContainerStyle: ViewStyle = {
    minHeight: height - GALLERY_HEADER_HEIGHT,
    paddingLeft: safeAreaInsets.left,
    paddingRight: safeAreaInsets.right,
  }


  return (
    <ScrollView contentContainerStyle={scrollScreenContentContainerStyle}>
      <View style={styles.textContainer}>
        <Text variant={"titleLarge"} style={styles.permissionMessageTitle}>
          {translate("Gallery_noPermission")}
        </Text>

        <Text variant={"bodyLarge"} style={styles.permissionMessageDescription}>
          {translate("Gallery_photoAccessPermissionDescription")}
        </Text>

        <Text variant={"bodyLarge"} style={styles.permissionMessageTopic}>
          &bull; {translate("Gallery_allowPhotoAccessWithGrantPermission")}
        </Text>

        <Text variant={"bodyLarge"} style={styles.permissionMessageTopic}>
          &bull; {translate("Gallery_allowPhotoAccessThroughSettings")}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button mode={"outlined"} onPress={Linking.openSettings}>
          {translate("Gallery_openSettings")}
        </Button>

        <Button mode={"contained"} onPress={requestPermission}>
          {translate("Gallery_grantPermission")}
        </Button>
      </View>
    </ScrollView>
  )
}
