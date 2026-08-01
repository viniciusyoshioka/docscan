import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'

import type { DocumentEntity } from '@database'
import { useServices } from '@database'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError, stringifyError } from '@utils'
import { DOCUMENT_ITEM_HEIGHT } from '../components'
import { HOME_HEADER_HEIGHT } from '../home.constants.ts'


export enum DocumentStatus {
  INITIAL = 'INITIAL',
  IS_LOADING = 'IS_LOADING',
  IS_LOADING_MORE = 'IS_LOADING_MORE',
  HAS_ERROR = 'HAS_ERROR',
  HAS_ERROR_LOADING_MORE = 'HAS_ERROR_LOADING_MORE',
  IS_EMPTY = 'IS_EMPTY',
  HAS_DATA = 'HAS_DATA',
}


interface DocumentListParams {
  onDocumentsLoaded?: () => void
}

type DocumentList = {
  status: DocumentStatus
  data: DocumentEntity[]
  error: Error | null
  loadDocuments: (count?: number) => Promise<void>
  loadMoreDocuments: (count?: number) => Promise<void>
}


export function useDocumentList(params?: DocumentListParams): DocumentList {
  const { onDocumentsLoaded } = params ?? {}


  const { height } = useWindowDimensions()

  const { documentService } = useServices()
  const logger = useLogger()

  const [hasLoadedAllDocuments, setHasLoadedAllDocuments] = useState(false)
  const [status, setStatus] = useState(DocumentStatus.INITIAL)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<DocumentEntity[]>([])

  const initialCountToLoad = useMemo(() => {
    const availableHeightForDocumentsList = height - HOME_HEADER_HEIGHT
    const countToLoad = Math.ceil(
      availableHeightForDocumentsList / DOCUMENT_ITEM_HEIGHT,
    )
    return countToLoad
  }, [height])


  const loadDocuments = useCallback(async (count = initialCountToLoad) => {
    if (status === DocumentStatus.IS_LOADING) return
    if (status === DocumentStatus.IS_LOADING_MORE) return

    try {
      setHasLoadedAllDocuments(false)
      setStatus(DocumentStatus.IS_LOADING)
      setError(null)
      setData([])

      const { data: documents } = await documentService.findPaginated({
        limit: count,
        page: 1,
      })

      const newHasLoadedAllDocuments = documents.length < count
      const newState = documents.length
        ? DocumentStatus.HAS_DATA
        : DocumentStatus.IS_EMPTY

      setHasLoadedAllDocuments(newHasLoadedAllDocuments)
      setStatus(newState)
      setData(documents)
      onDocumentsLoaded?.()
    } catch (error) {
      const errorMessage = stringifyError(error)
      const errorStack = getErrorStackTrace(error)
      const normalizedError = normalizeError(error)

      setHasLoadedAllDocuments(false)
      setStatus(DocumentStatus.HAS_ERROR)
      setError(normalizedError)
      setData([])

      await logger.error(
        `Error loading documents: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [initialCountToLoad, status, documentService, onDocumentsLoaded, logger])

  const loadMoreDocuments = useCallback(async (count = initialCountToLoad) => {
    if (status === DocumentStatus.IS_LOADING) return
    if (status === DocumentStatus.IS_LOADING_MORE) return
    if (hasLoadedAllDocuments) return

    try {
      setStatus(DocumentStatus.IS_LOADING_MORE)
      setError(null)

      const { data: documents } = await documentService.findPaginated({
        limit: count,
        offset: data.length,
      })

      const newHasLoadedAllDocuments = documents.length < count
      const newState = !!data.length || !!documents.length
        ? DocumentStatus.HAS_DATA
        : DocumentStatus.IS_EMPTY

      setHasLoadedAllDocuments(newHasLoadedAllDocuments)
      setStatus(newState)
      setError(null)
      setData(currentData => [...currentData, ...documents])
    } catch (error) {
      const errorMessage = stringifyError(error)
      const errorStack = getErrorStackTrace(error)
      const normalizedError = normalizeError(error)

      setStatus(DocumentStatus.HAS_ERROR_LOADING_MORE)
      setError(normalizedError)

      await logger.error(
        `Error loading more documents: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    initialCountToLoad,
    status,
    hasLoadedAllDocuments,
    documentService,
    data,
    logger,
  ])


  useFocusEffect(useCallback(() => {
    loadDocuments(initialCountToLoad)
  }, []))


  const documentList = useMemo(() => ({
    status,
    data,
    error,
    loadDocuments,
    loadMoreDocuments,
  }), [
    status,
    data,
    error,
    loadDocuments,
    loadMoreDocuments,
  ])


  return documentList
}
