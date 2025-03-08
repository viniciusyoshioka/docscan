import { useCallback, useEffect, useState } from "react"

import { DocumentDTO, EntityId, useEntityModels } from "@database"
import { useDocumentState } from "@libs/document-state"
import { useLogger } from "@libs/logger"
import { normalizeError, stringifyError } from "@utils"


export enum PicturesListStatus {
  INITIAL = "INITIAL",
  IS_LOADING = "IS_LOADING",
  IS_LOADING_MORE = "IS_LOADING_MORE",
  HAS_ERROR = "HAS_ERROR",
  HAS_ERROR_LOADING_MORE = "HAS_ERROR_LOADING_MORE",
  IS_EMPTY = "IS_EMPTY",
  HAS_DATA = "HAS_DATA",
}


interface PicturesList {
  status: PicturesListStatus
  error?: Error
  loadPictures: (count?: number) => Promise<void>
  loadMorePictures: (count?: number) => Promise<void>
}


export function usePicturesList(
  documentId: EntityId | undefined,
  amountToLoadPerTime = 16,
): PicturesList {


  const logger = useLogger()
  const { pictureModel } = useEntityModels()
  const { documentState, updateDocumentState } = useDocumentState()

  const [hasLoadedAllPictures, setHasLoadedAllPictures] = useState(false)
  const [status, setStatus] = useState(PicturesListStatus.INITIAL)
  const [error, setError] = useState<Error | undefined>()


  const loadPictures = useCallback(async (count = amountToLoadPerTime) => {
    if (!documentId) return
    if (status === PicturesListStatus.IS_LOADING) return
    if (status === PicturesListStatus.IS_LOADING_MORE) return

    try {
      setHasLoadedAllPictures(false)
      setStatus(PicturesListStatus.IS_LOADING)
      setError(undefined)
      updateDocumentState({
        type: "setPictures",
        payload: {
          pictures: [],
        },
      })

      const pictures = await pictureModel.findByDocumentIdPaginated({
        documentId,
        limit: count,
        offset: 0,
      })

      const newHasLoadedAllPictures = pictures.length < count
      const newState = pictures.length
        ? PicturesListStatus.HAS_DATA
        : PicturesListStatus.IS_EMPTY

      setHasLoadedAllPictures(newHasLoadedAllPictures)
      setStatus(newState)
      updateDocumentState({
        type: "setPictures",
        payload: { pictures },
      })
    } catch (error) {
      const errorMessage = stringifyError(error)
      const normalizedError = normalizeError(error)

      setHasLoadedAllPictures(false)
      setStatus(PicturesListStatus.HAS_ERROR)
      setError(normalizedError)
      updateDocumentState({
        type: "setPictures",
        payload: {
          pictures: [],
        },
      })

      await logger.error(`Error loading pictures: ${errorMessage}`)
    }
  }, [amountToLoadPerTime, documentId, status, updateDocumentState, pictureModel, logger])


  const loadMorePictures = useCallback(async (count = amountToLoadPerTime) => {
    if (!documentId) return
    if (!documentState) return
    if (status === PicturesListStatus.IS_LOADING) return
    if (status === PicturesListStatus.IS_LOADING_MORE) return
    if (hasLoadedAllPictures) return

    try {
      setStatus(PicturesListStatus.IS_LOADING_MORE)
      setError(undefined)

      const pictures = await pictureModel.findByDocumentIdPaginated({
        documentId,
        limit: count,
        offset: documentState.pictures.length,
      })

      const newHasLoadedAllPictures = pictures.length < count
      const newState = (documentState.pictures.length || pictures.length)
        ? PicturesListStatus.HAS_DATA
        : PicturesListStatus.IS_EMPTY

      setHasLoadedAllPictures(newHasLoadedAllPictures)
      setStatus(newState)
      setError(undefined)
      updateDocumentState({
        type: "addPictures",
        payload: {
          document: documentState.document as DocumentDTO,
          pictures,
        },
      })
    } catch (error) {
      const errorMessage = stringifyError(error)
      const normalizedError = normalizeError(error)

      setStatus(PicturesListStatus.HAS_ERROR_LOADING_MORE)
      setError(normalizedError)

      await logger.error(`Error loading more pictures: ${errorMessage}`)
    }
  }, [
    amountToLoadPerTime,
    documentId,
    documentState,
    status,
    hasLoadedAllPictures,
    pictureModel,
    updateDocumentState,
    logger,
  ])


  useEffect(() => {
    loadPictures()
  }, [])


  return {
    status,
    error,
    loadPictures,
    loadMorePictures,
  }
}
