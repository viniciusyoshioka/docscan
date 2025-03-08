import { useWindowDimensions } from "react-native"

import { EDIT_DOCUMENT_HEADER_HEIGHT } from "../../EditDocumentHeader"
import { usePictureItemSize } from "../components"
import { usePicturesColumnCount } from "./usePicturesColumnCount"


export function usePicturesCountToLoad(): number {


  const { height } = useWindowDimensions()

  const columnCount = usePicturesColumnCount()
  const pictureItemSize = usePictureItemSize()


  const availableHeightInWindow = height - EDIT_DOCUMENT_HEADER_HEIGHT
  const countToLoadInOneColumn = availableHeightInWindow / pictureItemSize
  const countToLoadInAllColumns = countToLoadInOneColumn * columnCount
  const countToLoadExcedingWindow = countToLoadInAllColumns * 2


  return Math.ceil(countToLoadExcedingWindow)
}
