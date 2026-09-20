import { useMemo, useState } from 'react'


export interface ImageViewSize {
  width: number
  height: number
}


interface UseImageViewSizeResult {
  imageViewSize: ImageViewSize
  setImageViewSize: (size: ImageViewSize) => void
}


export function useImageViewSize(): UseImageViewSizeResult {


  const [imageViewSize, setImageViewSize] = useState<ImageViewSize>({
    width: 0,
    height: 0,
  })


  const imageViewSizeResult = useMemo<UseImageViewSizeResult>(() => ({
    imageViewSize,
    setImageViewSize,
  }), [imageViewSize])


  return imageViewSizeResult
}
