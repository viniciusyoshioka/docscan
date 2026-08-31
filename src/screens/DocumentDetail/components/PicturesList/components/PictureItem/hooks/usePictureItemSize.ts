import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { usePicturesColumnCount } from '../../../hooks'
import { PICTURE_ITEM_MARGIN } from '../constants.ts'


const MARGIN_WIDTH = 2 * PICTURE_ITEM_MARGIN
const GAP_WIDTH = 2 * PICTURE_ITEM_MARGIN


export function usePictureItemSize(): number {


  const { width } = useWindowDimensions()

  const columnCount = usePicturesColumnCount()


  const pictureItemSize = useMemo(() => {
    const amountOfGapBetweenPictures = columnCount - 1

    const totalGapSize = amountOfGapBetweenPictures * GAP_WIDTH
    const marginSizeOnBothSides = 2 * MARGIN_WIDTH

    const totalSpaceAvailableForPictureItem = (
      width - marginSizeOnBothSides - totalGapSize
    )
    const pictureItemSize = Math.round(
      totalSpaceAvailableForPictureItem / columnCount,
    )

    return pictureItemSize
  }, [width, columnCount])


  return pictureItemSize
}
