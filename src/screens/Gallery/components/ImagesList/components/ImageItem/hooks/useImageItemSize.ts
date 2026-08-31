import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { useGalleryColumnCount } from '../../../hooks'


export function useImageItemSize(): number {


  const { width } = useWindowDimensions()

  const columnCount = useGalleryColumnCount()


  const imageItemSize = useMemo(() => {
    return (width / columnCount)
  }, [width, columnCount])


  return imageItemSize
}
