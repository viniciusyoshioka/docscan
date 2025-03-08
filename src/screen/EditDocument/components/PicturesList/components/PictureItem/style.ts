import { createStyleSheet } from "react-native-unistyles"

import { PICTURE_ITEM_MARGIN } from "./constants"


export const stylesheet = createStyleSheet(theme => ({
  pictureButton: (pictureItemSize: number) => ({
    width: pictureItemSize,
    margin: PICTURE_ITEM_MARGIN,
    borderRadius: theme.shape.small,
    aspectRatio: 1,
    overflow: "hidden",
  }),
  image: (pictureItemSize: number) => ({
    width: pictureItemSize,
    aspectRatio: 1,
    resizeMode: "cover",
  }),
}))
