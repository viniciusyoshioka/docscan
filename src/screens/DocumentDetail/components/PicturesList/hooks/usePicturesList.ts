import { useCallback, useEffect, useMemo, useState } from 'react'

import { useServices } from '@database'
import { useDocumentState } from '@modules/document-state'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError, stringifyError } from '@utils'
import { usePicturesCountToLoad } from './usePicturesCountToLoad.ts'


export enum PicturesListStatus {
  INITIAL = 'INITIAL',
  IS_LOADING = 'IS_LOADING',
  IS_LOADING_MORE = 'IS_LOADING_MORE',
  HAS_ERROR = 'HAS_ERROR',
  HAS_ERROR_LOADING_MORE = 'HAS_ERROR_LOADING_MORE',
  IS_EMPTY = 'IS_EMPTY',
  HAS_DATA = 'HAS_DATA',
}


interface PicturesList {
  status: PicturesListStatus
  error: Error | null
  loadPictures: () => Promise<void>
  loadMorePictures: () => Promise<void>
}


export function usePicturesList(): PicturesList {


  const logger = useLogger()
  const { pictureService } = useServices()
  const { document, pictures, setPictures } = useDocumentState()

  const amountToLoad = usePicturesCountToLoad()

  const [hasLoadedAllPictures, setHasLoadedAllPictures] = useState(false)
  const [status, setStatus] = useState(PicturesListStatus.INITIAL)
  const [error, setError] = useState<Error | null>(null)


  const loadPictures = useCallback(async () => {
    if (!document?.id) return
    if (status === PicturesListStatus.IS_LOADING) return
    if (status === PicturesListStatus.IS_LOADING_MORE) return

    try {
      setHasLoadedAllPictures(false)
      setStatus(PicturesListStatus.IS_LOADING)
      setError(null)

      const picturesLoaded = await pictureService.findPaginated({
        documentId: document.id,
        page: 1,
        limit: amountToLoad,
      })

      const newHasLoadedAllPictures =
        picturesLoaded.data.length < amountToLoad
      const newStatus = picturesLoaded.data.length
        ? PicturesListStatus.HAS_DATA
        : PicturesListStatus.IS_EMPTY

      setHasLoadedAllPictures(newHasLoadedAllPictures)
      setStatus(newStatus)

      setPictures(picturesLoaded.data)
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(errorInstance)
      const errorStack = getErrorStackTrace(errorInstance)

      setHasLoadedAllPictures(false)
      setStatus(PicturesListStatus.HAS_ERROR)
      setError(errorInstance)

      setPictures([])

      await logger.error(
        `Error loading pictures (documentId: ${document.id}): "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    document,
    status,
    pictureService,
    amountToLoad,
    setPictures,
    logger,
  ])


  const loadMorePictures = useCallback(async () => {
    if (!document?.id) return
    if (status === PicturesListStatus.IS_LOADING) return
    if (status === PicturesListStatus.IS_LOADING_MORE) return
    if (hasLoadedAllPictures) return

    try {
      setStatus(PicturesListStatus.IS_LOADING_MORE)
      setError(null)

      const picturesLoaded = await pictureService.findPaginated({
        documentId: document.id,
        page: Math.floor(pictures.length / amountToLoad) + 1,
        limit: amountToLoad,
      })

      const newHasLoadedAllPictures =
        picturesLoaded.data.length < amountToLoad
      const newStatus = (picturesLoaded.data.length || pictures.length)
        ? PicturesListStatus.HAS_DATA
        : PicturesListStatus.IS_EMPTY

      setHasLoadedAllPictures(newHasLoadedAllPictures)
      setStatus(newStatus)
      setError(null)

      setPictures([
        ...pictures,
        ...picturesLoaded.data,
      ])
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(errorInstance)
      const errorStack = getErrorStackTrace(errorInstance)

      setStatus(PicturesListStatus.HAS_ERROR_LOADING_MORE)
      setError(errorInstance)

      await logger.error(
        `Error loading more pictures (documentId: ${document.id}): "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    document,
    status,
    hasLoadedAllPictures,
    pictureService,
    amountToLoad,
    pictures,
    setPictures,
    logger,
  ])


  useEffect(() => {
    loadPictures()
  }, [])


  const picturesList = useMemo(() => ({
    status,
    error,
    loadPictures,
    loadMorePictures,
  }), [
    status,
    error,
    loadPictures,
    loadMorePictures,
  ])


  return picturesList
}
