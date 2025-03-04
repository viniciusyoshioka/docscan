import { View } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { useStyles } from "react-native-unistyles"

import { stylesheet } from "./styles"


interface LoadingMoreImagesListProps {}


export function LoadingMoreImagesList(props: LoadingMoreImagesListProps) {


  const { styles } = useStyles(stylesheet)


  return (
    <View style={styles.container}>
      <ActivityIndicator size={"small"} />
    </View>
  )
}
