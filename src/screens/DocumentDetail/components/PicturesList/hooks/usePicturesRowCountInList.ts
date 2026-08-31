import { useWindowDimensions } from 'react-native'

import { DOCUMENT_DETAIL_HEADER_HEIGHT } from '../../../document-detail.constants.ts'
import { usePictureItemSize } from '../components'


export function usePicturesRowCountInList(): number {


  const { height } = useWindowDimensions()

  const pictureItemSize = usePictureItemSize()


  const picturesListAvailableHeight = height - DOCUMENT_DETAIL_HEADER_HEIGHT
  const picturesListRowsCount = Math.ceil(
    picturesListAvailableHeight / pictureItemSize,
  )


  return picturesListRowsCount
}
