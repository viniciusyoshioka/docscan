import { useEffect, useMemo, useState } from 'react'
import { Image } from 'react-native'

import { useLogger } from '@modules/logger'
import { normalizeError } from '@utils'
import type { ImageViewSize } from './useImageViewSize.ts'


interface ImageSizeParams {
  imageAbsolutePathOrUri: string | undefined
  imageViewSize: ImageViewSize
}


export interface ImageSize {
  width: number
  height: number
}


interface ImageSizeResult {
  isLoading: boolean
  error: Error | null
  imageSize: ImageSize
}


const INITIAL_IMAGE_SIZE: ImageSize = {
  width: 0,
  height: 0,
}


// TODO: Handle error getting image size
export function useImageSize(params: ImageSizeParams): ImageSizeResult {
  const { imageAbsolutePathOrUri, imageViewSize } = params


  const logger = useLogger()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [imageSize, setImageSize] = useState<ImageSize>(INITIAL_IMAGE_SIZE)


  function resizeImageToFitImageView(
    imageWidth: number,
    imageHeight: number,
  ): ImageSize {
    const imageRatio = imageWidth / imageHeight

    let newImageWidth = imageViewSize.width
    let newImageHeight = imageViewSize.width / imageRatio
    if (newImageHeight > imageViewSize.height) {
      newImageWidth = imageViewSize.height * imageRatio
      newImageHeight = imageViewSize.height
    }

    return {
      width: newImageWidth,
      height: newImageHeight,
    }
  }


  async function getImageSize() {
    if (isLoading) {
      return
    }
    if (!imageAbsolutePathOrUri) {
      console.warn(
        'Image absolute path or URI is empty or undefined. Cannot get image size',
      )
      return
    }
    if (imageViewSize.width === 0 || imageViewSize.height === 0) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { width, height } = await Image.getSize(imageAbsolutePathOrUri)
      const resizedImageSize = resizeImageToFitImageView(width, height)

      setIsLoading(false)
      setImageSize(resizedImageSize)
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = errorInstance.message
      const errorStack = errorInstance.stack

      setIsLoading(false)
      setError(errorInstance)

      await logger.error(
        `Error getting image size: "${errorMessage}"`,
        errorStack,
      )
    }
  }


  useEffect(() => {
    getImageSize()
  }, [imageViewSize])


  const imageSizeResult = useMemo<ImageSizeResult>(() => ({
    isLoading,
    error,
    imageSize,
  }), [isLoading, error, imageSize])


  return imageSizeResult
}
