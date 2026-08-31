import Color from 'color'
import { memo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { View } from 'react-native'
import { Icon } from 'react-native-paper-towel'

import { useAppTheme } from '@theme'
import { styles } from './styles.ts'


interface SelectionOverlayProps {
  isSelectionMode: boolean
  isSelected: boolean
}


export const SelectionOverlay = memo((props: SelectionOverlayProps) => {


  const { colors } = useAppTheme()


  const isSelected = props.isSelectionMode && props.isSelected

  const opacity = isSelected ? 1 : 0
  const backgroundColor = Color(colors.primary)
    .alpha(0.5)
    .rgb()
    .toString()

  const selectionOverlayStyle: StyleProp<ViewStyle> = {
    ...styles.selectionOverlay,
    opacity,
    backgroundColor,
  }


  return (
    <View style={selectionOverlayStyle}>
      <Icon
        name={'check'}
        size={32}
        color={colors.onPrimary}
        style={{ position: 'absolute' }}
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
