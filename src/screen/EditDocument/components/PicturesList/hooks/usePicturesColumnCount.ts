import { useMemo } from "react"
import { useWindowDimensions } from "react-native"


const PICTURE_ITEM_COLUMN_COUNT_VERTICAL = 2
const PICTURE_ITEM_COLUMN_COUNT_HORIZONTAL = 4


export function usePicturesColumnCount(): number {


  const { width, height } = useWindowDimensions()


  const columnCount = useMemo(() => {
    if (width < height) {
      return PICTURE_ITEM_COLUMN_COUNT_VERTICAL
    }
    return PICTURE_ITEM_COLUMN_COUNT_HORIZONTAL
  }, [width, height])


  return columnCount
}
