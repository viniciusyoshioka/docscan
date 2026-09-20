import type { RefObject } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Images } from 'react-native-nitro-image'

import type { PictureEntity } from '@database'
import { useServices } from '@database'
import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { AbsolutePath, useFileSystem } from '@modules/file-system'
import { Info } from '@modules/info'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, normalizeError } from '@utils'
import type { ImageRotationRef } from '../components'


interface RotateImage {
  imageRotationRef: RefObject<ImageRotationRef | null>
  isRotationMode: boolean
  isSavingRotatedPicture: boolean

  openRotation: () => void
  exitRotation: () => void

  rotateLeft: () => void
  rotateRight: () => void

  saveRotatedImage: () => void
}


export function useRotateImage(currentPictureIndex: number): RotateImage {


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()
  const fileSystem = useFileSystem()
  const { documentService, pictureService } = useServices()
  const { document, pictures, updatePicture } = useDocumentState()

  const imageRotationRef = useRef<ImageRotationRef | null>(null)

  const [isRotationMode, setIsRotationMode] = useState(false)
  const [isSavingRotatedPicture, setIsSavingRotatedPicture] = useState(false)


  const openRotation = useCallback(() => {
    setIsRotationMode(true)
  }, [])

  const exitRotation = useCallback(() => {
    if (isSavingRotatedPicture) return

    setIsRotationMode(false)
  }, [isSavingRotatedPicture])


  const rotateLeft = useCallback(() => {
    if (!isRotationMode) return
    if (isSavingRotatedPicture) return
    if (!imageRotationRef.current) return

    imageRotationRef.current.rotateLeft()
  }, [isRotationMode, isSavingRotatedPicture, imageRotationRef])

  const rotateRight = useCallback(() => {
    if (!isRotationMode) return
    if (isSavingRotatedPicture) return
    if (!imageRotationRef.current) return

    imageRotationRef.current.rotateRight()
  }, [isRotationMode, isSavingRotatedPicture, imageRotationRef])


  // TODO: This image handling can be extracted to another module to avoid
  // using libraries directly
  const rotateImageToNewPath = useCallback(async (
    originalPicturePath: AbsolutePath,
    rotatedPicturePath: AbsolutePath,
    degreeToRotate: number,
  ) => {
    const originalPicture = await Images.loadFromFileAsync(
      originalPicturePath.absolutePath,
    )

    const rotatedPicture = await originalPicture.rotateAsync(
      degreeToRotate,
      false,
    )

    const imageFormat = originalPicturePath.fileExtension?.toLowerCase() === 'png'
      ? 'png'
      : 'jpg'

    await rotatedPicture.saveToFileAsync(
      rotatedPicturePath.absolutePath,
      imageFormat,
      100,
    )
  }, [])

  const updateRotatedPicture = useCallback(
    async (
      pictureToUpdate: PictureEntity,
      rotatedFilePath: AbsolutePath,
    ) => {
      const documentId = document?.id
      if (!documentId) return

      const data = await pictureService.transaction(async tx => {
        const updatedPicture = await pictureService.update(
          pictureToUpdate.id,
          {
            fileName: rotatedFilePath.baseName,
            position: pictureToUpdate.position,
          },
          tx,
        )

        const updatedDocument = await documentService.updateUpdatedAt(
          documentId,
          tx,
        )

        return { updatedPicture, updatedDocument }
      })

      updatePicture(data.updatedPicture, data.updatedDocument)
    },
    [
      document,
      pictureService,
      documentService,
      updatePicture,
    ],
  )

  const deleteOriginalPicture = useCallback(
    async (originalPicturePath: AbsolutePath) => {
      try {
        await fileSystem.deleteFile(originalPicturePath)
      } catch (error) {
        const errorInstance = normalizeError(error)
        const errorMessage = errorInstance.message
        const errorStack = getErrorStackTrace(errorInstance)

        await logger.debug(
          `Error deleting original picture after rotation: "${errorMessage}"`,
          errorStack,
        )
      }
    },
    [fileSystem, logger],
  )

  const showErrorSavingRotatedImageAlert = useCallback(() => {
    alert.show({
      title: t('warn'),
      description: t(
        'PictureDetail_alert_errorSavingRotatedImage_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])

  const saveRotatedImage = useCallback(async () => {
    if (!document) return
    if (!isRotationMode) return
    if (isSavingRotatedPicture) return
    if (!imageRotationRef.current) return

    const rotatedDegrees = imageRotationRef.current.getRotationDegree()
    if (rotatedDegrees % 360 === 0) {
      setIsRotationMode(false)
      setIsSavingRotatedPicture(false)
      return
    }

    try {
      setIsSavingRotatedPicture(true)

      const currentPicture = pictures.at(currentPictureIndex)
      if (!currentPicture) {
        throw new Error(
          `No picture found at index currentPictureIndex (${currentPictureIndex})`,
        )
      }

      const originalPicturePath = new AbsolutePath([
        Info.folders.internal.pictures,
        currentPicture.fileName,
      ])

      const rotatedPicturePath = await fileSystem.getNewRandomFileBasedAt(
        originalPicturePath,
      )

      await rotateImageToNewPath(
        originalPicturePath,
        rotatedPicturePath,
        rotatedDegrees,
      )

      await updateRotatedPicture(currentPicture, rotatedPicturePath)

      await deleteOriginalPicture(originalPicturePath)

      setIsRotationMode(false)
      setIsSavingRotatedPicture(false)
    } catch (error) {
      const errorInstance = normalizeError(error)
      const errorMessage = errorInstance.message
      const errorStack = getErrorStackTrace(errorInstance)

      await logger.error(
        `Error saving rotated picture: "${errorMessage}"`,
        errorStack,
      )

      showErrorSavingRotatedImageAlert()
      setIsRotationMode(false)
      setIsSavingRotatedPicture(false)
    }
  }, [
    document,
    isRotationMode,
    isSavingRotatedPicture,
    imageRotationRef,
    pictures,
    currentPictureIndex,
    fileSystem,
    rotateImageToNewPath,
    updateRotatedPicture,
    deleteOriginalPicture,
    logger,
    showErrorSavingRotatedImageAlert,
  ])


  const rotateImage = useMemo<RotateImage>(() => ({
    imageRotationRef,
    isRotationMode,
    isSavingRotatedPicture,
    openRotation,
    exitRotation,
    rotateLeft,
    rotateRight,
    saveRotatedImage,
  }), [
    imageRotationRef,
    isRotationMode,
    isSavingRotatedPicture,
    openRotation,
    exitRotation,
    rotateLeft,
    rotateRight,
    saveRotatedImage,
  ])


  return rotateImage
}
