import FastImage from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Pressable } from "react-native-paper-towel"
import { runOnJS } from "react-native-reanimated"
import { SelectableItem, useSelectableItem } from "react-native-selection-mode"
import { useStyles } from "react-native-unistyles"

import { useAppTheme } from "@theme"
import { SelectionLayer } from "./SelectionLayer"
import { stylesheet } from "./style"
import { useColumnCount } from "./useColumnCount"
import { usePictureItemSize } from "./usePictureItemSize"


export { useColumnCount, usePictureItemSize }


export interface PictureItemProps extends SelectableItem {
  picturePath: string
}


export function PictureItem(props: PictureItemProps) {


  const { styles } = useStyles(stylesheet)
  const { onPress, onLongPress } = useSelectableItem(props)

  const { colors } = useAppTheme()
  const pictureItemSize = usePictureItemSize()


  const longPressGesture = Gesture.LongPress()
    .maxDistance(30)
    .minDuration(400)
    .onStart(event => runOnJS(onLongPress)())


  return (
    <GestureDetector gesture={longPressGesture}>
      <Pressable
        style={styles.pictureButton(pictureItemSize)}
        onPress={onPress}
        android_ripple={{ color: colors.primary, foreground: true }}
      >
        <FastImage
          source={{ uri: `file://${props.picturePath}` }}
          style={styles.pictureImage}
        />

        <SelectionLayer
          isVisible={props.isSelectionMode && props.isSelected}
        />
      </Pressable>
    </GestureDetector>
  )
}
