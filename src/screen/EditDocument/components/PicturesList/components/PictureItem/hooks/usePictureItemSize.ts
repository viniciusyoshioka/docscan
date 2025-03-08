import { useMemo } from "react"
import { useWindowDimensions } from "react-native"

import { usePicturesColumnCount } from "../../../hooks"
import { getPictureItemSize } from "../utils"


export function usePictureItemSize(): number {


  const { width } = useWindowDimensions()

  const columnCount = usePicturesColumnCount()


  const pictureItemSize = useMemo(() => {
    return getPictureItemSize(width, columnCount)
  }, [width, columnCount])


  return pictureItemSize
}
