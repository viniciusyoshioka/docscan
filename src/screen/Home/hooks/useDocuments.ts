import { useCallback, useEffect, useState } from "react"

import { DocumentDTO, GetDocumentsPaginatedDTO, useEntityModels } from "@database"
import { useLogger } from "@libs/logger"
import { normalizeError, stringifyError } from "@utils"


const DOCUMENT_COUNT_TO_LOAD = 10


type DocumentState = {
  isLoading: boolean
  data: DocumentDTO[]
  error?: Error
  loadMore: (count: number) => Promise<void>
}


// TODO: Check if needs useMemo for the returned object
export function useDocuments(): DocumentState {


  const { documentModel } = useEntityModels()
  const logger = useLogger()

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DocumentDTO[]>([])
  const [error, setError] = useState<Error | undefined>()


  const getDocuments = useCallback(async (options: GetDocumentsPaginatedDTO) => {
    try {
      setIsLoading(true)
      setError(undefined)

      const documents = await documentModel.getDocumentsPaginated(options)

      setIsLoading(false)
      setData(currentDocuments => [
        ...currentDocuments,
        ...documents,
      ])
      setError(undefined)
    } catch (error) {
      const errorMessage = stringifyError(error)
      const normalizedError = normalizeError(error)

      logger.error(`Error loading documents: ${errorMessage}`)

      setIsLoading(false)
      setError(normalizedError)
    }
  }, [documentModel])

  const loadMore = useCallback(async (count = DOCUMENT_COUNT_TO_LOAD) => {
    await getDocuments({
      limit: count,
      offset: data.length,
    })
  }, [getDocuments, data])


  useEffect(() => {
    getDocuments({ limit: DOCUMENT_COUNT_TO_LOAD, offset: 0 })
  }, [])


  return {
    isLoading,
    data,
    error,
    loadMore,
  }
}
