import { View } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { useStyles } from "react-native-unistyles"

import { stylesheet } from "./styles"


interface LoadingMoreDocumentsProps {}


export function LoadingMoreDocuments(props: LoadingMoreDocumentsProps) {


  const { styles } = useStyles(stylesheet)


  return (
    <View style={styles.container}>
      <ActivityIndicator size={"small"} />
    </View>
  )
}
