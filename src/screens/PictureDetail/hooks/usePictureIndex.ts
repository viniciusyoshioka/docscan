import { clamp } from 'lodash'
import { useCallback, useMemo, useState } from 'react'

import { useDocumentState } from '@modules/document-state'
import { useScreenParams } from '@routes'


interface PictureIndex {
  initialPictureIndex: number
  currentPictureIndex: number
  setCurrentPictureIndex: (newCurrentPictureIndex: number) => void
}


export function usePictureIndex(): PictureIndex {


  const screenParams = useScreenParams<'PictureDetail'>()
  const { pictures } = useDocumentState()

  const initialPictureIndex = screenParams.pictureIndex
  const [currentPictureIndex, setCurrentPictureIndex] = useState(
    initialPictureIndex,
  )


  const setNewCurrentPictureIndex = useCallback(
    (newCurrentPictureIndex: number) => {
      const picturesCount = pictures?.length ?? 0

      const minimumIndex = 0
      const maximumIndex = Math.max(0, picturesCount - 1)

      const initialScrollIndex = clamp(
        newCurrentPictureIndex,
        minimumIndex,
        maximumIndex,
      )

      setCurrentPictureIndex(initialScrollIndex)
    },
    [pictures],
  )


  const pictureIndex = useMemo<PictureIndex>(() => ({
    initialPictureIndex,
    currentPictureIndex,
    setCurrentPictureIndex: setNewCurrentPictureIndex,
  }), [initialPictureIndex, currentPictureIndex, setNewCurrentPictureIndex])


  return pictureIndex
}
