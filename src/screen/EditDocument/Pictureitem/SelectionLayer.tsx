import { View } from "react-native"
import { Icon } from "react-native-paper-towel"
import { useStyles } from "react-native-unistyles"

import { useAppTheme } from "@theme"
import { stylesheet } from "./style"


export interface SelectionLayerProps {
  isVisible: boolean
}


export function SelectionLayer(props: SelectionLayerProps) {


  const { styles } = useStyles(stylesheet)

  const { colors } = useAppTheme()


  if (!props.isVisible) {
    return null
  }


  return (
    <View style={styles.selectedSurface}>
      <Icon
        name={"check"}
        size={32}
        color={colors.onPrimary}
      />
    </View>
  )
}
