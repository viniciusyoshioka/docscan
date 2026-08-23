import { useGalleryColumnCount } from './useGalleryColumnCount.ts'
import { useImagesRowCountInList } from './useImagesRowCountInList.ts'


export function useImagesCountToLoad(): number {


  const columnCount = useGalleryColumnCount()
  const imagesRowCountInList = useImagesRowCountInList()


  const rowsCountToFillListAndAllowScroll = Math.ceil(
    imagesRowCountInList * 3,
  )
  const amountOfImagesToLoadPerTime = (
    rowsCountToFillListAndAllowScroll * columnCount
  )


  return amountOfImagesToLoadPerTime
}
