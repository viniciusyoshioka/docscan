import { useGalleryColumnCount } from "./useGalleryColumnCount"
import { useImagesRowCountInList } from "./useImagesRowCountInList"


export function useImagesCountToLoad(): number {


  const columnCount = useGalleryColumnCount()
  const imagesRowCountInList = useImagesRowCountInList()


  const rowsCountToFillListAndAllowScroll = Math.ceil(imagesRowCountInList * 1.5)
  const amountOfImagesToLoadPerTime = rowsCountToFillListAndAllowScroll * columnCount


  return amountOfImagesToLoadPerTime
}
