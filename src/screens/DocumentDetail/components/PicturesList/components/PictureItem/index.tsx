import type { ImageStyle } from '@d11/react-native-fast-image'
import FastImage from '@d11/react-native-fast-image'
import Color from 'color'
import { memo, useMemo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { GestureDetector, useLongPressGesture } from 'react-native-gesture-handler'
import { Pressable } from 'react-native-paper-towel'
import type { SelectableItem } from 'react-native-selection-mode'
import { useSelectableItem } from 'react-native-selection-mode'
import { scheduleOnRN } from 'react-native-worklets'

import type { PictureEntity } from '@database'
import { AbsolutePath, PathUtils } from '@modules/file-system'
import { Info } from '@modules/info'
import { useAppTheme } from '@theme'
import { SelectionOverlay } from './components'
import { styles } from './style.ts'


export { PICTURE_ITEM_MARGIN } from './constants.ts'
export { usePictureItemSize } from './hooks'


interface PictureItemProps extends SelectableItem<PictureEntity> {
  pictureItemSize: number
}


export const PictureItem = memo((props: PictureItemProps) => {
  const { item, pictureItemSize } = props


  const { onPress, onLongPress } = useSelectableItem(props)

  const { colors, state, shape } = useAppTheme()


  const pictureUri = useMemo(() => {
    const picturePath = new AbsolutePath([
      Info.folders.internal.pictures,
      item.fileName,
    ])

    return PathUtils.withFileProtocol(picturePath)
  }, [item])


  const pictureButtonStyle: StyleProp<ViewStyle> = {
    ...styles.pictureButton,
    width: pictureItemSize,
    borderRadius: shape.small,
  }

  const imageStyle: StyleProp<ImageStyle> = {
    ...styles.image,
    width: pictureItemSize,
  }

  const rippleColor = Color(colors.primary)
    .alpha(state.hover)
    .rgb()
    .toString()


  const longPressGesture = useLongPressGesture({
    maxDistance: 30,
    minDuration: 400,
    onActivate: event => {
      scheduleOnRN(onLongPress)
    },
  })


  return (
    <GestureDetector gesture={longPressGesture}>
      <Pressable
        style={pictureButtonStyle}
        onPress={onPress}
        android_ripple={{ color: rippleColor, foreground: true }}
      >
        <FastImage
          source={{ uri: pictureUri }}
          style={imageStyle}
        />

        <SelectionOverlay
          isSelected={props.isSelected}
          isSelectionMode={props.isSelectionMode}
        />
      </Pressable>
    </GestureDetector>
  )
}, propsAreEqual)


function propsAreEqual(
  prevProps: Readonly<PictureItemProps>,
  nextProps: Readonly<PictureItemProps>,
): boolean {
  const samePictureItemSize =
    prevProps.pictureItemSize === nextProps.pictureItemSize
  const sameIsSelected =
    prevProps.isSelected === nextProps.isSelected
  const sameIsSelectionMode =
    prevProps.isSelectionMode === nextProps.isSelectionMode

  return samePictureItemSize
    && sameIsSelected
    && sameIsSelectionMode
}
