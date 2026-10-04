import { useNavigation } from '@react-navigation/native'
import type { RefObject } from 'react'
import { useCallback } from 'react'

import { useServices } from '@database'
import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { AbsolutePath, useFileSystem } from '@modules/file-system'
import { Info } from '@modules/info'
import { useLogger } from '@modules/logger'
import type { NavigationProps } from '@routes'
import { PictureAction, useScreenParams } from '@routes'
import { normalizeError } from '@utils'
import type { CameraViewRef } from '../components'


type TakePicture = () => Promise<void>


export function useTakePicture(
  cameraViewRef: RefObject<CameraViewRef | null>,
): TakePicture {


  const navigation = useNavigation<NavigationProps<'Camera'>>()
  const screenParams = useScreenParams<'Camera'>()

  const alert = useAlert()
  const logger = useLogger()
  const { t } = useLocale()
  const fileSystem = useFileSystem()
  const { documentService, pictureService } = useServices()
  const {
    document,
    pictures,
    addPictures,
    updatePicture,
    setDocument,
  } = useDocumentState()


  const movePhotoToPicturesFolder = useCallback(
    async (photoPath: AbsolutePath) => {
      const newPicturePath = new AbsolutePath([
        Info.folders.internal.pictures,
        photoPath.baseName,
      ])

      // TODO: There is a low chance of this file name already exists on
      // `Info.folders.internal.pictures`
      await fileSystem.moveFile(photoPath, newPicturePath)

      return newPicturePath
    },
    [fileSystem],
  )


  const replacePicture = useCallback(async (picturePath: AbsolutePath) => {
    if (screenParams?.action !== PictureAction.REPLACE_PICTURE) {
      throw new Error(
        `Cannot call replacePicture when action is not ${PictureAction.REPLACE_PICTURE}`,
      )
    }
    if (!document) {
      throw new Error('Cannot replace picture when no document is open')
    }
    if (!document.id) {
      throw new Error('Cannot replace picture when document is not saved')
    }

    const existingDocumentId = document.id
    const previousPicture = pictures[screenParams.replaceIndex]

    const data = await documentService.transaction(async tx => {
      const updatedPicture = await pictureService.update(
        previousPicture.id,
        {
          fileName: picturePath.baseName,
        },
        tx,
      )

      const updatedDocument = await documentService.updateUpdatedAt(
        existingDocumentId,
        tx,
      )

      return { updatedDocument, updatedPicture }
    })

    updatePicture(data.updatedPicture, data.updatedDocument)

    // TODO: Delete previous picture file

    navigation.navigate('PictureDetail', {
      pictureIndex: screenParams.replaceIndex,
    })
  }, [
    screenParams,
    document,
    pictures,
    documentService,
    pictureService,
    updatePicture,
    navigation,
  ])

  const addPicture = useCallback(async (picturePath: AbsolutePath) => {
    const documentId = document?.id

    const data = await pictureService.transaction(async tx => {
      const upsertDocument = documentId
        ? await documentService.updateUpdatedAt(
            documentId,
            tx,
          )
        : await documentService.create(
            {
              title: t('document_newDocumentName', { ns: Namespaces.APP }),
            },
            tx,
          )

      const [createdPicture] = await pictureService.createMany(
        {
          documentId: upsertDocument.id,
          fileNames: [picturePath.baseName],
        },
        tx,
      )

      return { createdPicture, upsertDocument }
    })

    if (documentId) {
      addPictures([data.createdPicture], data.upsertDocument)
    } else {
      setDocument(data.upsertDocument, [data.createdPicture])
    }
  }, [
    document,
    pictureService,
    documentService,
    t,
    addPictures,
    setDocument,
  ])


  const takePicture = useCallback<TakePicture>(async () => {
    if (!cameraViewRef.current) {
      await logger.debug(
        'Cannot take picture because cameraViewRef is not available',
      )
      return
    }

    try {
      const photoPath = await cameraViewRef.current.takePhoto()
      const picturePath = await movePhotoToPicturesFolder(photoPath)

      if (screenParams?.action === PictureAction.REPLACE_PICTURE) {
        await replacePicture(picturePath)
      } else {
        await addPicture(picturePath)
      }
    } catch (error) {
      const errorInstance = normalizeError(error)
      const errorMessage = errorInstance.message
      const errorStack = errorInstance.stack

      alert.show({
        icon: 'alert-outline',
        title: t('warn'),
        description: t(
          'Camera_alert_unknownErrorTakingPicture_text',
          { ns: Namespaces.APP },
        ),
      })

      await logger.error(
        `Error taking picture: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [
    cameraViewRef,
    logger,
    movePhotoToPicturesFolder,
    screenParams,
    replacePicture,
    addPicture,
    alert,
    t,
  ])


  return takePicture
}
