import { useCallback, useEffect } from 'react'

import { DocumentStatus } from './useDocumentList.ts'


const FINAL_STATUS = [
  DocumentStatus.IS_EMPTY,
  DocumentStatus.HAS_DATA,
]


interface OnFinishLoadingDocumentListParams {
  totalDocuments: number
}

type OnFinishLoadingDocumentList = (
  params: OnFinishLoadingDocumentListParams,
) => void


interface UseOnFinishLoadingDocumentListParams {
  status: DocumentStatus
  totalDocuments: number
  onFinishLoadingDocumentList: OnFinishLoadingDocumentList
}


export function useOnFinishLoadingDocumentList(
  params: UseOnFinishLoadingDocumentListParams,
) {
  const { status, totalDocuments, onFinishLoadingDocumentList } = params


  const checkFinishLoadingDocumentList = useCallback(() => {
    const hasLoaded = FINAL_STATUS.includes(status)
    if (!hasLoaded) {
      return
    }

    onFinishLoadingDocumentList({
      totalDocuments,
    })
  }, [status, totalDocuments, onFinishLoadingDocumentList])


  useEffect(() => {
    checkFinishLoadingDocumentList()
  }, [status])
}
