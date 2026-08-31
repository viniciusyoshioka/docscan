import { useWindowDimensions } from 'react-native'

import { DOCUMENT_DETAIL_HEADER_HEIGHT } from '../../../document-detail.constants.ts'
import { usePictureItemSize } from '../components'
import { usePicturesColumnCount } from './usePicturesColumnCount.ts'


export function usePicturesCountToLoad(): number {


  const { height } = useWindowDimensions()

  const columnCount = usePicturesColumnCount()
  const pictureItemSize = usePictureItemSize()


  const availableHeightInWindow = height - DOCUMENT_DETAIL_HEADER_HEIGHT
  const countToLoadInOneColumn = availableHeightInWindow / pictureItemSize
  const countToLoadInAllColumns = countToLoadInOneColumn * columnCount
  const countToLoadExceedingWindow = countToLoadInAllColumns * 2


  return Math.ceil(countToLoadExceedingWindow)
}
