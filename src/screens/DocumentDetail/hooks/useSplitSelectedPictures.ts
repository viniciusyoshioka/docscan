import { useCallback, useMemo, useState } from 'react'

import { useServices } from '@database'
import { useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { useLogger } from '@modules/logger'


interface SplitSelectedPictures {
  isLoading: boolean
  splitSelectedPictures: () => void
}


export function useSplitSelectedPictures(): SplitSelectedPictures {


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()
  const { documentService, pictureService } = useServices()
  const { document, pictures } = useDocumentState()

  const [isLoading, setIsLoading] = useState(false)


  const splittingSelectedPicturesAlert = useMemo(() => {
    // TODO: Implement
    return 0
  }, [])


  const showSelectedPicturesSpittedSuccessfullyAlert = useCallback(() => {
    // TODO: Implement
  }, [])


  const showErrorSplittingSelectedPicturesAlert = useCallback(() => {
    // TODO: Implement
  }, [])


  const trySplitSelectedPictures = useCallback(() => {
    // TODO: Implement
  }, [])


  const showConfirmSplitSelectedPicturesAlert = useCallback(() => {
    // TODO: Implement
  }, [])


  const splitSelectedPictures = useMemo<SplitSelectedPictures>(() => ({
    isLoading,
    splitSelectedPictures: showConfirmSplitSelectedPicturesAlert,
  }), [isLoading, showConfirmSplitSelectedPicturesAlert])


  return splitSelectedPictures
}
