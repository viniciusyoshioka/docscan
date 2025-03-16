import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import { useCallback, useEffect, useRef, useState } from "react"

import { useLogger } from "@libs/logger"
import { normalizeError, stringifyError } from "@utils"
import { useRequestReadMediaImagesPermission } from "./useRequestReadMediaImagesPermission"


export enum ImagesListStatus {
  IS_LOADING = "IS_LOADING",
  IS_LOADING_MORE = "IS_LOADING_MORE",
  HAS_ERROR_LOADING = "HAS_ERROR_LOADING",
  HAS_ERROR_LOADING_MORE = "HAS_ERROR_LOADING_MORE",
  NO_PERMISSION = "NO_PERMISSION",
  IS_EMPTY = "IS_EMPTY",
  HAS_DATA = "HAS_DATA",
}


interface ImagesList {
  status: ImagesListStatus
  error?: Error
  images: string[]
  loadImages: () => Promise<void>
  loadMoreImages: () => Promise<void>
}


export function useImagesList(amountToLoadPerTime = 20): ImagesList {


  const logger = useLogger()

  const cursor = useRef<string | undefined>()
  const [hasLoadedAllImages, setHasLoadedAllImages] = useState(false)

  const [status, setStatus] = useState(ImagesListStatus.NO_PERMISSION)
  const [error, setError] = useState<Error | undefined>()
  const [images, setImages] = useState<string[]>([])

  const requestReadMediaImagesPermission = useRequestReadMediaImagesPermission()


  const loadImages = useCallback(async () => {
    if (status === ImagesListStatus.IS_LOADING) return
    if (status === ImagesListStatus.IS_LOADING_MORE) return

    try {
      cursor.current = undefined
      setHasLoadedAllImages(false)
      setStatus(ImagesListStatus.IS_LOADING)
      setError(undefined)
      setImages([])

      const hasReadMediaImagesPermission = await requestReadMediaImagesPermission()
      if (!hasReadMediaImagesPermission) {
        setStatus(ImagesListStatus.NO_PERMISSION)
        return
      }

      const photoIdentifier = await CameraRoll.getPhotos({
        assetType: "Photos",
        first: amountToLoadPerTime,
        after: cursor.current,
      })

      const hasLoadedAllImagesFromGallery = !photoIdentifier.page_info.has_next_page
      const imagesLoaded = photoIdentifier.edges.map(edge => edge.node.image.uri)
      const newStatus = imagesLoaded.length
        ? ImagesListStatus.HAS_DATA
        : ImagesListStatus.IS_EMPTY

      cursor.current = photoIdentifier.page_info.end_cursor
      setHasLoadedAllImages(hasLoadedAllImagesFromGallery)
      setStatus(newStatus)
      setError(undefined)
      setImages(imagesLoaded)
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(err)

      cursor.current = undefined
      setHasLoadedAllImages(false)
      setStatus(ImagesListStatus.HAS_ERROR_LOADING)
      setError(errorInstance)
      setImages([])

      await logger.error(`Error loading images from gallery: ${errorMessage}`)
    }
  }, [status, requestReadMediaImagesPermission, logger])

  const loadMoreImages = useCallback(async () => {
    if (status === ImagesListStatus.IS_LOADING) return
    if (status === ImagesListStatus.IS_LOADING_MORE) return
    if (hasLoadedAllImages) return

    try {
      setStatus(ImagesListStatus.IS_LOADING_MORE)
      setError(undefined)

      const hasReadMediaImagesPermission = await requestReadMediaImagesPermission()
      if (!hasReadMediaImagesPermission) {
        cursor.current = undefined
        setHasLoadedAllImages(false)
        setStatus(ImagesListStatus.NO_PERMISSION)
        setError(undefined)
        setImages([])
        return
      }

      const photoIdentifier = await CameraRoll.getPhotos({
        assetType: "Photos",
        first: amountToLoadPerTime,
        after: cursor.current,
      })

      const hasLoadedAllImagesFromGallery = !photoIdentifier.page_info.has_next_page
      const imagesLoaded = photoIdentifier.edges.map(edge => edge.node.image.uri)
      const newStatus = !!imagesLoaded.length || !!images.length
        ? ImagesListStatus.HAS_DATA
        : ImagesListStatus.IS_EMPTY

      cursor.current = photoIdentifier.page_info.end_cursor
      setHasLoadedAllImages(hasLoadedAllImagesFromGallery)
      setStatus(newStatus)
      setError(undefined)
      setImages(currentImages => [...currentImages, ...imagesLoaded])
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(err)

      setStatus(ImagesListStatus.HAS_ERROR_LOADING_MORE)
      setError(errorInstance)

      await logger.error(`Error loading more images from gallery: ${errorMessage}`)
    }
  }, [status, hasLoadedAllImages, requestReadMediaImagesPermission, logger])


  useEffect(() => {
    loadImages()
  }, [])


  return {
    status,
    error,
    images,
    loadImages,
    loadMoreImages,
  }
}
