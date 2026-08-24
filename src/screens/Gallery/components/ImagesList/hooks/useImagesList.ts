import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLogger } from '@modules/logger'
import { Permissions, PermissionUtils } from '@modules/permission'
import { getErrorStackTrace, normalizeError, stringifyError } from '@utils'
import { useRequestReadStoragePermission } from './useRequestReadStoragePermission.ts'


enum LoadType {
  INITIAL = 'INITIAL',
  REFRESH = 'REFRESH',
}


export enum ImagesListStatus {
  IS_LOADING = 'IS_LOADING',
  IS_LOADING_MORE = 'IS_LOADING_MORE',
  IS_REFRESHING = 'IS_REFRESHING',
  HAS_ERROR_LOADING = 'HAS_ERROR_LOADING',
  HAS_ERROR_LOADING_MORE = 'HAS_ERROR_LOADING_MORE',
  NO_PERMISSION = 'NO_PERMISSION',
  IS_EMPTY = 'IS_EMPTY',
  HAS_DATA = 'HAS_DATA',
}


export interface ImageResource {
  uri: string
  extension: string | null
}

interface ImagesList {
  status: ImagesListStatus
  error: Error | null
  images: ImageResource[]
  loadImages: () => Promise<void>
  loadMoreImages: () => Promise<void>
  refreshImages: () => Promise<void>
}


export function useImagesList(amountToLoadPerTime = 20): ImagesList {


  const logger = useLogger()

  const cursor = useRef<string | undefined>(undefined)
  const [hasLoadedAllImages, setHasLoadedAllImages] = useState(false)

  const [status, setStatus] = useState(ImagesListStatus.NO_PERMISSION)
  const [error, setError] = useState<Error | null>(null)
  const [images, setImages] = useState<ImageResource[]>([])

  const checkAndRequestReadStoragePermission = useRequestReadStoragePermission()


  const _loadImages = useCallback(async (loadType: LoadType) => {
    if (status === ImagesListStatus.IS_LOADING) return
    if (status === ImagesListStatus.IS_LOADING_MORE) return
    if (status === ImagesListStatus.IS_REFRESHING) return

    try {
      const loadingStatus = loadType === LoadType.INITIAL
        ? ImagesListStatus.IS_LOADING
        : ImagesListStatus.IS_REFRESHING

      cursor.current = undefined
      setHasLoadedAllImages(false)
      setStatus(loadingStatus)
      setError(null)
      setImages([])

      const permissionResult = await checkAndRequestReadStoragePermission()
      const [permissionStatus, permissionError] = permissionResult

      if (permissionError) {
        setStatus(ImagesListStatus.HAS_ERROR_LOADING)
        setError(permissionError)
        await logger.error(
          `Error checking or requesting ${Permissions.READ_STORAGE} permission`,
          permissionError.stack,
        )
        return
      }

      const hasPermission = PermissionUtils.isGranted(permissionStatus)
      if (!hasPermission) {
        setStatus(ImagesListStatus.NO_PERMISSION)
        await logger.debug(`Permission ${Permissions.READ_STORAGE} was not granted to load gallery images`)
        return
      }

      const photoIdentifier = await CameraRoll.getPhotos({
        assetType: 'Photos',
        first: amountToLoadPerTime,
        after: cursor.current,
      })

      const newHasLoadedAllImages = !photoIdentifier.page_info.has_next_page
      const imagesLoaded = photoIdentifier.edges.map<ImageResource>(edge => ({
        uri: edge.node.image.uri,
        extension: edge.node.image.extension,
      }))
      const newStatus = imagesLoaded.length
        ? ImagesListStatus.HAS_DATA
        : ImagesListStatus.IS_EMPTY

      cursor.current = photoIdentifier.page_info.end_cursor
      setHasLoadedAllImages(newHasLoadedAllImages)
      setStatus(newStatus)
      setError(null)
      setImages(imagesLoaded)
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(errorInstance)
      const errorStack = getErrorStackTrace(errorInstance)

      cursor.current = undefined
      setHasLoadedAllImages(false)
      setStatus(ImagesListStatus.HAS_ERROR_LOADING)
      setError(errorInstance)
      setImages([])

      if (loadType === LoadType.INITIAL) {
        await logger.error(
          `Error loading images from gallery: ${errorMessage}`,
          errorStack,
        )
      } else {
        await logger.error(
          `Error refreshing images from gallery: ${errorMessage}`,
          errorStack,
        )
      }
    }
  }, [status, checkAndRequestReadStoragePermission, logger])

  const loadImages = useCallback(async () => {
    await _loadImages(LoadType.INITIAL)
  }, [_loadImages])

  const loadMoreImages = useCallback(async () => {
    if (status === ImagesListStatus.IS_LOADING) return
    if (status === ImagesListStatus.IS_LOADING_MORE) return
    if (status === ImagesListStatus.IS_REFRESHING) return
    if (hasLoadedAllImages) return

    try {
      setStatus(ImagesListStatus.IS_LOADING_MORE)
      setError(null)

      const permissionResult = await checkAndRequestReadStoragePermission()
      const [permissionStatus, permissionError] = permissionResult

      if (permissionError) {
        setStatus(ImagesListStatus.HAS_ERROR_LOADING_MORE)
        setError(permissionError)
        await logger.error(
          `Error checking or requesting ${Permissions.READ_STORAGE} permission`,
          permissionError.stack,
        )
        return
      }

      const hasPermission = PermissionUtils.isGranted(permissionStatus)
      if (!hasPermission) {
        cursor.current = undefined
        setHasLoadedAllImages(false)
        setStatus(ImagesListStatus.NO_PERMISSION)
        setError(null)
        setImages([])
        await logger.debug(`Permission ${Permissions.READ_STORAGE} was not granted to load more gallery images`)
        return
      }

      const photoIdentifier = await CameraRoll.getPhotos({
        assetType: 'Photos',
        first: amountToLoadPerTime,
        after: cursor.current,
      })

      const newHasLoadedAllImages = !photoIdentifier.page_info.has_next_page
      const imagesLoaded = photoIdentifier.edges.map<ImageResource>(edge => ({
        uri: edge.node.image.uri,
        extension: edge.node.image.extension,
      }))
      const newStatus = !!imagesLoaded.length || !!images.length
        ? ImagesListStatus.HAS_DATA
        : ImagesListStatus.IS_EMPTY

      cursor.current = photoIdentifier.page_info.end_cursor
      setHasLoadedAllImages(newHasLoadedAllImages)
      setStatus(newStatus)
      setError(null)
      setImages(currentImages => [...currentImages, ...imagesLoaded])
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(errorInstance)
      const errorStack = getErrorStackTrace(errorInstance)

      setStatus(ImagesListStatus.HAS_ERROR_LOADING_MORE)
      setError(errorInstance)

      await logger.error(
        `Error loading more images from gallery: ${errorMessage}`,
        errorStack,
      )
    }
  }, [status, hasLoadedAllImages, checkAndRequestReadStoragePermission, logger])

  const refreshImages = useCallback(async () => {
    await _loadImages(LoadType.REFRESH)
  }, [_loadImages])


  useEffect(() => {
    loadImages()
  }, [])


  const imagesList = useMemo<ImagesList>(() => ({
    status,
    error,
    images,
    loadImages,
    loadMoreImages,
    refreshImages,
  }), [
    status,
    error,
    images,
    loadImages,
    loadMoreImages,
    refreshImages,
  ])


  return imagesList
}
