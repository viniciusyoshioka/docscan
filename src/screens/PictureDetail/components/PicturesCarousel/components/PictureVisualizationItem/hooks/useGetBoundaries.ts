import type { ImageSize, ImageViewSize } from '../../../../../hooks'


interface GetBoundariesParams {
  zoomMargin: number
  imageSize: ImageSize
  imageViewSize: ImageViewSize
}


export interface Boundaries {
  x: number
  y: number
}

type GetBoundaries = (zoom: number) => Boundaries


export function useGetBoundaries(
  params: GetBoundariesParams,
): GetBoundaries {
  const { zoomMargin, imageSize, imageViewSize } = params


  function getBoundaries(zoom: number): Boundaries {
    'worklet'

    const margin = (zoom === 0) ? 0 : zoomMargin
    const limitX = ((imageSize.width * zoom) - imageViewSize.width) / 2
    const limitY = ((imageSize.height * zoom) - imageViewSize.height) / 2

    return {
      x: limitX + margin,
      y: limitY + margin,
    }
  }


  return getBoundaries
}
