import { useCallback } from 'react'


interface GoBackParams {
  hasBlockingModal: boolean
  isSelectionMode: boolean
  exitSelection: () => void
}


type GoBack = () => boolean


export function useGoBack(params: GoBackParams): GoBack {


  const goBack = useCallback<GoBack>(() => {
    if (params.hasBlockingModal) {
      return true
    }

    if (params.isSelectionMode) {
      params.exitSelection()
      return true
    }

    return false
  }, [
    params.hasBlockingModal,
    params.isSelectionMode,
    params.exitSelection,
  ])


  return goBack
}
