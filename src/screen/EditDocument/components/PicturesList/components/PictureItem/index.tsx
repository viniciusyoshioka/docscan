import Color from "color"
import { memo, useMemo } from "react"
import FastImage from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Pressable } from "react-native-paper-towel"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"
import { useStyles } from "react-native-unistyles"

import { useAppTheme } from "@theme"
import { SelectionOverlay } from "./components"
import { stylesheet } from "./style"


export { PICTURE_ITEM_MARGIN } from "./constants"
export { usePictureItemSize } from "./hooks"


interface PictureItemProps extends SelectableItem {
  picturePath: string
  pictureItemSize: number
}


export const PictureItem = memo((props: PictureItemProps) => {
  const { picturePath, pictureItemSize } = props


  const { onPress, onLongPress } = useSelectableItem(props)
  const unistyles = useStyles(stylesheet)

  const { colors, state } = useAppTheme()

  const styles = useMemo(() => {
    const pictureItemButton = unistyles.styles.pictureButton(pictureItemSize)
    const image = unistyles.styles.image(pictureItemSize)
    return { pictureItemButton, image }
  }, [unistyles.styles, pictureItemSize])

  const rippleColor = Color(colors.primary)
    .alpha(state.hover)
    .rgb()
    .toString()


  const longPressGesture = Gesture.LongPress()
    .maxDistance(30)
    .minDuration(400)
    .onStart(event => runOnJS(onLongPress)())


  return (
    <GestureDetector gesture={longPressGesture}>
      <Pressable
        style={styles.pictureItemButton}
        onPress={onPress}
        android_ripple={{ color: rippleColor, foreground: true }}
      >
        <FastImage
          source={{ uri: `file://${picturePath}` }}
          style={styles.image}
        />

        <SelectionOverlay
          isSelected={props.isSelected}
          isSelectionMode={props.isSelectionMode}
        />
      </Pressable>
    </GestureDetector>
  )
}, propsAreEqual)


function propsAreEqual(prevProps: PictureItemProps, nextProps: PictureItemProps): boolean {
  const samePicturePath = prevProps.picturePath === nextProps.picturePath
  const samePictureItemSize = prevProps.pictureItemSize === nextProps.pictureItemSize
  const sameIsSelected = prevProps.isSelected === nextProps.isSelected
  const sameIsSelectionMode = prevProps.isSelectionMode === nextProps.isSelectionMode
  return samePicturePath && samePictureItemSize && sameIsSelected && sameIsSelectionMode
}
