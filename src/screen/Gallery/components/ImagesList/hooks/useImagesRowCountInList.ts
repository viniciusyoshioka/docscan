import { useWindowDimensions } from "react-native"

import { GALLERY_HEADER_HEIGHT } from "../../Header"
import { useImageItemSize } from "../../ImageItem"


export function useImagesRowCountInList(): number {


  const { height } = useWindowDimensions()

  const imageItemSize = useImageItemSize()


  const imagesListAvailableHeight = height - GALLERY_HEADER_HEIGHT
  const imagesListRowsCount = Math.ceil(imagesListAvailableHeight / imageItemSize)


  return imagesListRowsCount
}
