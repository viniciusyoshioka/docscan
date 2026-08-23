import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { useGalleryColumnCount } from '../../../hooks'
import { getImageItemSize } from '../utils'


export function useImageItemSize(): number {


  const { width } = useWindowDimensions()

  const columnCount = useGalleryColumnCount()


  const imageItemSize = useMemo(() => {
    return getImageItemSize(width, columnCount)
  }, [width, columnCount])


  return imageItemSize
}
