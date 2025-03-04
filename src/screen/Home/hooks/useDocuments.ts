import { useCallback, useEffect, useState } from "react"

import { DocumentDTO, useEntityModels } from "@database"
import { useLogger } from "@libs/logger"
import { normalizeError, stringifyError } from "@utils"


const DOCUMENT_COUNT_TO_LOAD = 10


export enum DocumentStatus {
  INITIAL = "INITIAL",
  IS_LOADING = "IS_LOADING",
  IS_LOADING_MORE = "IS_LOADING_MORE",
  HAS_ERROR = "HAS_ERROR",
  HAS_ERROR_LOADING_MORE = "HAS_ERROR_LOADING_MORE",
  IS_EMPTY = "IS_EMPTY",
  HAS_DATA = "HAS_DATA",
}


type DocumentListState = {
  status: DocumentStatus
  data: DocumentDTO[]
  error?: Error
  loadDocuments: (count: number) => Promise<void>
  loadMoreDocuments: (count: number) => Promise<void>
}


export function useDocuments(): DocumentListState {


  const { documentModel } = useEntityModels()
  const logger = useLogger()

  const [hasLoadedAllDocuments, setHasLoadedAllDocuments] = useState(false)

  const [status, setStatus] = useState(DocumentStatus.INITIAL)
  const [data, setData] = useState<DocumentDTO[]>([])
  const [error, setError] = useState<Error | undefined>()


  const loadDocuments = useCallback(async (count = DOCUMENT_COUNT_TO_LOAD) => {
    if (status === DocumentStatus.IS_LOADING) return
    if (status === DocumentStatus.IS_LOADING_MORE) return

    try {
      setHasLoadedAllDocuments(false)
      setStatus(DocumentStatus.IS_LOADING)
      setData([])
      setError(undefined)

      const documents = await documentModel.getDocumentsPaginated({
        limit: count,
        offset: 0,
      })

      const newHasLoadedAllDocuments = documents.length < count
      const newState = documents.length
        ? DocumentStatus.HAS_DATA
        : DocumentStatus.IS_EMPTY

      setHasLoadedAllDocuments(newHasLoadedAllDocuments)
      setStatus(newState)
      setData(documents)
    } catch (error) {
      const errorMessage = stringifyError(error)
      const normalizedError = normalizeError(error)

      setHasLoadedAllDocuments(false)
      setStatus(DocumentStatus.HAS_ERROR)
      setData([])
      setError(normalizedError)

      await logger.error(`Error loading documents: ${errorMessage}`)
    }
  }, [status, documentModel, logger])

  const loadMoreDocuments = useCallback(async (count = DOCUMENT_COUNT_TO_LOAD) => {
    if (status === DocumentStatus.IS_LOADING) return
    if (status === DocumentStatus.IS_LOADING_MORE) return
    if (hasLoadedAllDocuments) return

    try {
      setStatus(DocumentStatus.IS_LOADING_MORE)
      setError(undefined)

      const documents = await documentModel.getDocumentsPaginated({
        limit: count,
        offset: data.length,
      })

      const newHasLoadedAllDocuments = documents.length < count
      const newState = !!data.length || !!documents.length
        ? DocumentStatus.HAS_DATA
        : DocumentStatus.IS_EMPTY

      setHasLoadedAllDocuments(newHasLoadedAllDocuments)
      setStatus(newState)
      setData(documents)
      setError(undefined)
    } catch (error) {
      const errorMessage = stringifyError(error)
      const normalizedError = normalizeError(error)

      setStatus(DocumentStatus.HAS_ERROR_LOADING_MORE)
      setError(normalizedError)

      await logger.error(`Error loading more documents: ${errorMessage}`)
    }
  }, [status, hasLoadedAllDocuments, documentModel, data, logger])


  useEffect(() => {
    loadDocuments(DOCUMENT_COUNT_TO_LOAD)
  }, [])


  return {
    status,
    data,
    error,
    loadDocuments,
    loadMoreDocuments,
  }
}
