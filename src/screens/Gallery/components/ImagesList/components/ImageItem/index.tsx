import type { ImageStyle } from '@d11/react-native-fast-image'
import FastImage from '@d11/react-native-fast-image'
import { memo, useMemo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { Pressable } from 'react-native'
import { GestureDetector, useLongPressGesture } from 'react-native-gesture-handler'
import type { SelectableItem } from 'react-native-selection-mode'
import { useSelectableItem } from 'react-native-selection-mode'
import { scheduleOnRN } from 'react-native-worklets'

import { PictureAction } from '@routes'
import type { ImageResource } from '../../hooks'
import { SelectionOverlay } from './components'
import { styles } from './style.ts'


export { useImageItemSize } from './hooks'


interface ImageItemProps extends SelectableItem<ImageResource> {
  action: PictureAction
  imageItemSize: number
}


export const ImageItem = memo((props: ImageItemProps) => {
  const { item, action, imageItemSize } = props


  const { onPress, onLongPress } = useSelectableItem(props)


  const imageItemButtonStyle = useMemo<StyleProp<ViewStyle>>(() => ({
    ...styles.imageItemButton,
    width: imageItemSize,
  }), [imageItemSize])

  const imageStyle = useMemo<StyleProp<ImageStyle>>(() => ({
    ...styles.image,
    width: imageItemSize,
  }), [imageItemSize])


  const longPressGesture = useLongPressGesture({
    maxDistance: 30,
    minDuration: 400,
    onActivate: event => {
      if (action === PictureAction.REPLACE_PICTURE) return
      scheduleOnRN(onLongPress)
    },
  })


  return (
    <GestureDetector gesture={longPressGesture}>
      <Pressable onPress={onPress} style={imageItemButtonStyle}>
        <FastImage
          source={{ uri: item.uri }}
          style={imageStyle}
        />

        <SelectionOverlay
          isSelectionMode={props.isSelectionMode}
          isSelected={props.isSelected}
        />
      </Pressable>
    </GestureDetector>
  )
}, propsAreEqual)


function propsAreEqual(
  prevProps: Readonly<ImageItemProps>,
  nextProps: Readonly<ImageItemProps>,
): boolean {
  const sameItem =
    prevProps.item === nextProps.item
  const sameAction =
    prevProps.action === nextProps.action
  const sameImageItemSize =
    prevProps.imageItemSize === nextProps.imageItemSize
  const sameIsSelected =
    prevProps.isSelected === nextProps.isSelected
  const sameIsSelectionMode =
    prevProps.isSelectionMode === nextProps.isSelectionMode

  return (
    sameItem
    && sameAction
    && sameImageItemSize
    && sameIsSelected
    && sameIsSelectionMode
  )
}
