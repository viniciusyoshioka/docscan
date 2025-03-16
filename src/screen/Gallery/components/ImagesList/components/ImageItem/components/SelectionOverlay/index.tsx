import { memo } from "react"
import { View } from "react-native"
import { Icon } from "react-native-paper-towel"
import { useStyles } from "react-native-unistyles"

import { useAppTheme } from "@theme"
import { stylesheet } from "./styles"


interface SelectionOverlayProps {
  isSelectionMode: boolean
  isSelected: boolean
}


export const SelectionOverlay = memo((props: SelectionOverlayProps) => {


  const { styles } = useStyles(stylesheet)

  const { colors } = useAppTheme()


  const isSelected = props.isSelectionMode && props.isSelected
  const selectionOverlayStyle = styles.selectionOverlay(isSelected)


  return (
    <View style={selectionOverlayStyle}>
      <Icon
        name={"check"}
        size={32}
        color={colors.onPrimary}
        style={{ position: "absolute" }}
      />
    </View>
  )
}, propsAreEqual)


function propsAreEqual(
  prevProps: Readonly<SelectionOverlayProps>,
  nextProps: Readonly<SelectionOverlayProps>,
): boolean {
  return prevProps.isSelected === nextProps.isSelected
}
