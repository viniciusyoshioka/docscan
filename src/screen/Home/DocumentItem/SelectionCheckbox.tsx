import { Checkbox } from "react-native-paper"

import { useAppTheme } from "@theme"


export interface SelectionCheckbokProps {
  isSelectionMode: boolean
  isSelected: boolean
  onPress: () => void
}


export function SelectionCheckbok(props: SelectionCheckbokProps) {


  const { colors } = useAppTheme()


  if (!props.isSelectionMode) {
    return null
  }


  return (
    <Checkbox
      status={props.isSelected ? "checked" : "unchecked"}
      color={colors.primary}
      uncheckedColor={colors.onSurfaceVariant}
      onPress={props.onPress}
    />
  )
}
