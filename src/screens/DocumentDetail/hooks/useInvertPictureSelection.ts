import { useCallback } from 'react'
import type { SelectionMode } from 'react-native-selection-mode'

import type { PictureEntity, PictureId } from '@database'


interface InvertPictureSelectionParams {
  setSelectedData: SelectionMode<PictureId>['setNewSelectedData']
  pictures: PictureEntity[]
}


type InvertPictureSelection = () => void


// TODO: Instead of using the pictures array to invert the selection,
// should use a `inverse` flag to indicate that the selection is inverted.
// When inverted, the selected pictures are the ones that are not in the
// selectedData set. The reason this is needed is because the pictures array
// may be infinite and paginated, making impossible to get all pictures and
// invert the selection based on its id.
export function useInvertPictureSelection(
  params: InvertPictureSelectionParams,
): InvertPictureSelection {
  const { setSelectedData, pictures } = params


  const invertPictureSelection = useCallback(() => {
    setSelectedData(currentSelectedData => {
      const newSelectedData = new Set<PictureId>()

      for (let i = 0; i < pictures.length; i++) {
        const picture = pictures[i]

        const isSelected = currentSelectedData.has(picture.id)
        if (!isSelected) {
          newSelectedData.add(picture.id)
        }
      }

      return newSelectedData
    })
  }, [setSelectedData, pictures])


  return invertPictureSelection
}
