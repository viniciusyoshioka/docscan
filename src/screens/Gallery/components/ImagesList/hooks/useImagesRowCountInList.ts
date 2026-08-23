import { useWindowDimensions } from 'react-native'

import { GALLERY_HEADER_HEIGHT } from '../../../gallery.constants.ts'
import { useImageItemSize } from '../components'


export function useImagesRowCountInList(): number {


  const { height } = useWindowDimensions()

  const imageItemSize = useImageItemSize()


  const imagesListAvailableHeight = height - GALLERY_HEADER_HEIGHT
  const imagesListRowsCount = Math.ceil(
    imagesListAvailableHeight / imageItemSize,
  )


  return imagesListRowsCount
}
