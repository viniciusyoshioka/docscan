import { useWindowDimensions } from "react-native"

import { PICTURE_BUTTON_MARGIN } from "./style"
import { useColumnCount } from "./useColumnCount"


export function usePictureItemSize() {


  const { width } = useWindowDimensions()

  const columnCount = useColumnCount()


  const pictureMargin = (2 * PICTURE_BUTTON_MARGIN)
  const pictureWidthWithoutMargin = width - pictureMargin
  return (pictureWidthWithoutMargin / columnCount) - pictureMargin
}
