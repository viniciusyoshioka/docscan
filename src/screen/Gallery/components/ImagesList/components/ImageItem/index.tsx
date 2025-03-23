import { memo, useMemo } from "react"
import { Pressable } from "react-native"
import FastImage from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"
import { useStyles } from "react-native-unistyles"

import { PictureAction } from "@router"
import { PathUtils } from "@utils"
import { SelectionOverlay } from "./components"
import { stylesheet } from "./style"


export { useImageItemSize } from "./hooks"


interface ImageItemProps extends SelectableItem {
  imagePath: string
  action: PictureAction
  imageItemSize: number
}


export const ImageItem = memo((props: ImageItemProps) => {
  const { imagePath, action, imageItemSize } = props


  const { onPress, onLongPress } = useSelectableItem(props)
  const unistyles = useStyles(stylesheet)

  const imagePathWithFileProtocol = PathUtils.fullPathToFileProtocol(imagePath)
  const styles = useMemo(() => {
    const imageItemButton = unistyles.styles.imageItemButton(imageItemSize)
    const image = unistyles.styles.image(imageItemSize)
    return { imageItemButton, image }
  }, [unistyles.styles, imageItemSize])


  const longPressGesture = Gesture.LongPress()
    .maxDistance(30)
    .minDuration(400)
    .onStart(event => {
      if (action === "replace-picture") return
      runOnJS(onLongPress)()
    })


  return (
    <GestureDetector gesture={longPressGesture}>
      <Pressable onPress={onPress} style={styles.imageItemButton}>
        <FastImage source={{ uri: imagePathWithFileProtocol }} style={styles.image} />

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
  const sameImagePath = prevProps.imagePath === nextProps.imagePath
  const sameAction = prevProps.action === nextProps.action
  const sameImageItemSize = prevProps.imageItemSize === nextProps.imageItemSize
  const sameIsSelected = prevProps.isSelected === nextProps.isSelected
  const sameIsSelectionMode = prevProps.isSelectionMode === nextProps.isSelectionMode
  return sameImagePath && sameAction && sameImageItemSize && sameIsSelected && sameIsSelectionMode
}
