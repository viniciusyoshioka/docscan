import { useMemo } from "react"
import { useWindowDimensions } from "react-native"


const IMAGE_ITEM_COLUMN_COUNT_VERTICAL = 3
const IMAGE_ITEM_COLUMN_COUNT_HORIZONTAL = 7


export function useGalleryColumnCount(): number {


  const { width, height } = useWindowDimensions()


  const columnCount = useMemo(() => {
    if (width < height) {
      return IMAGE_ITEM_COLUMN_COUNT_VERTICAL
    }
    return IMAGE_ITEM_COLUMN_COUNT_HORIZONTAL
  }, [width, height])


  return columnCount
}
