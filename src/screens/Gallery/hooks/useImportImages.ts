import { useCallback, useMemo, useState } from 'react'

import { useServices } from '@database'
import { Namespaces, useLocale } from '@locale'
import { useDocumentState } from '@modules/document-state'
import { AbsolutePath, useFileSystem } from '@modules/file-system'
import { Info } from '@modules/info'
import { useLogger } from '@modules/logger'
import { PictureAction, useScreenParams } from '@routes'
import { getErrorStackTrace, normalizeError, stringifyError } from '@utils'
import type { ImageResource } from '../components'
import { useGoBack } from './useGoBack.ts'
import { useGoToPictureDetailScreen } from './useGoToPictureDetailScreen.ts'
import { useShowErrorImportingImagesAlert } from './useShowErrorImportingImagesAlert.ts'


interface ImportImagesParams {
  getSelectedImages: () => ImageResource[]
  isSelectionMode: boolean
  exitSelection: () => void
  onError?: (error: Error) => void
}


interface ImportImages {
  isImporting: boolean
  importSingleImage: (imageResource: ImageResource) => Promise<void>
  importSelectedImages: () => Promise<void>
}


export function useImportImages(params: ImportImagesParams): ImportImages {
  const { getSelectedImages, isSelectionMode, exitSelection, onError } = params


  const screenParams = useScreenParams<'Gallery'>()

  const { t } = useLocale()
  const logger = useLogger()
  const fileSystem = useFileSystem()
  const { documentService, pictureService } = useServices()
  const {
    document,
    pictures,
    setDocument,
    addPictures,
    updatePicture,
  } = useDocumentState()

  const [isImporting, setIsImporting] = useState(false)

  const goBack = useGoBack({
    hasBlockingModal: isImporting,
    exitSelection,
    isSelectionMode,
  })
  const goToPictureDetailScreen = useGoToPictureDetailScreen()
  const showErrorImportingImagesAlert = useShowErrorImportingImagesAlert()


  const assertParamsAreValidToImportImages = useCallback(
    (imageResources: ImageResource[]) => {
      if (
        screenParams.action === PictureAction.ADD_PICTURE
        && !imageResources.length
      ) {
        throw new Error(
          'One or more images must be imported from gallery when adding a picture',
        )
      }

      if (
        screenParams.action === PictureAction.REPLACE_PICTURE
        && imageResources.length !== 1
      ) {
        throw new Error(
          `Only one image can be imported from gallery when replacing a picture, trying to import ${imageResources.length}`,
        )
      }
    },
    [screenParams],
  )

  const copyImagesToApp = useCallback(
    async (imageResources: ImageResource[]): Promise<AbsolutePath[]> => {
      const picturePathsCopied: AbsolutePath[] = []

      for (let i = 0; i < imageResources.length; i++) {
        const imageResource = imageResources[i]

        const copiedPath = await fileSystem.copyUriToApp(
          imageResource.uri,
          imageResource.extension,
        )

        const picturePath = new AbsolutePath([
          Info.folders.internal.pictures,
          copiedPath.baseName,
        ])

        await fileSystem.moveFile(copiedPath, picturePath)
        picturePathsCopied.push(picturePath)
      }

      return picturePathsCopied
    },
    [],
  )


  const replaceImage = useCallback(async (imagePath: AbsolutePath) => {
    const data = await documentService.transaction(async tx => {
      if (screenParams.action !== PictureAction.REPLACE_PICTURE) {
        throw new Error(
          `Calling replaceImage when param action is not "${PictureAction.REPLACE_PICTURE}"`,
        )
      }

      if (!document) {
        throw new Error(
          'Cannot replace image if document is not open',
        )
      }
      if (!document.id) {
        throw new Error(
          'Cannot replace image if document is not saved',
        )
      }

      const pictureToReplace = pictures[screenParams.replaceIndex]
      const picturePathToDelete = new AbsolutePath([
        Info.folders.internal.pictures,
        pictureToReplace.fileName,
      ])

      const updatedPicture = await pictureService.update(
        pictureToReplace.id,
        {
          ...pictureToReplace,
          fileName: imagePath.baseName,
          position: screenParams.replaceIndex,
        },
        tx,
      )

      const updatedDocument = await documentService.updateUpdatedAt(
        document.id,
        tx,
      )

      return {
        updatedPicture,
        updatedDocument,
        picturePathToDelete,
      }
    })

    updatePicture(data.updatedPicture, data.updatedDocument)

    fileSystem.deleteFile(data.picturePathToDelete)
      .catch(async (error: unknown) => {
        const errorInstance = normalizeError(error)
        const errorMessage = stringifyError(errorInstance)
        const errorStack = getErrorStackTrace(errorInstance)

        try {
          await logger.error(
            `Error deleting previous picture file after replacing the picture image: "${errorMessage}". This error could be ignored`,
            errorStack,
          )
        // eslint-disable-next-line no-empty
        } catch (err) {}
      })
  }, [
    documentService,
    screenParams,
    document,
    pictures,
    pictureService,
    updatePicture,
    fileSystem,
    logger,
  ])


  const addImagesToExistingDocument = useCallback(
    async (imagesPath: AbsolutePath[]) => {
      const existingDocumentId = document?.id
      if (!existingDocumentId) {
        throw new Error(
          'Cannot import images from gallery and add to a document that is not saved',
        )
      }

      const data = await documentService.transaction(async tx => {
        const picturesFileNames = imagesPath.map(imagePath => {
          return imagePath.baseName
        })

        const createdPictures = await pictureService.createMany(
          {
            documentId: existingDocumentId,
            fileNames: picturesFileNames,
          },
          tx,
        )

        const updatedDocument = await documentService.updateUpdatedAt(
          existingDocumentId,
          tx,
        )

        return { createdPictures, updatedDocument }
      })

      addPictures(data.createdPictures, data.updatedDocument)
    },
    [
      document,
      documentService,
      pictureService,
      addPictures,
    ],
  )

  const addImagesToNewDocument = useCallback(
    async (imagesPath: AbsolutePath[]) => {
      const defaultDocumentTitle = t(
        'document_newDocumentName',
        { ns: Namespaces.APP },
      )

      const data = await documentService.transaction(async tx => {
        const createdDocument = await documentService.create(
          {
            title: defaultDocumentTitle,
          },
          tx,
        )

        const picturesFileNames = imagesPath.map(imagePath => {
          return imagePath.baseName
        })

        const createdPictures = await pictureService.createMany(
          {
            documentId: createdDocument.id,
            fileNames: picturesFileNames,
          },
          tx,
        )

        return { createdDocument, createdPictures }
      })

      setDocument(data.createdDocument, data.createdPictures)
    },
    [
      t,
      documentService,
      pictureService,
      setDocument,
    ],
  )

  const addImages = useCallback(async (imagesPath: AbsolutePath[]) => {
    if (screenParams.action !== PictureAction.ADD_PICTURE) {
      throw new Error(
        `Calling addImages when param action is not "${PictureAction.ADD_PICTURE}"`,
      )
    }

    const documentIsPersisted = !!document?.id
    if (documentIsPersisted) {
      await addImagesToExistingDocument(imagesPath)
    } else {
      await addImagesToNewDocument(imagesPath)
    }
  }, [
    screenParams,
    document,
    addImagesToExistingDocument,
    addImagesToNewDocument,
  ])


  const importImages = useCallback(async (imageResources: ImageResource[]) => {
    try {
      setIsImporting(true)

      assertParamsAreValidToImportImages(imageResources)
      const imagePathsCopiedToApp = await copyImagesToApp(imageResources)

      if (screenParams.action === PictureAction.REPLACE_PICTURE) {
        await replaceImage(imagePathsCopiedToApp[0])
        setIsImporting(false)
        goToPictureDetailScreen()
        return
      }

      await addImages(imagePathsCopiedToApp)
      setIsImporting(false)
      goBack()
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(errorInstance)
      const errorStack = getErrorStackTrace(errorInstance)

      if (screenParams.action === PictureAction.REPLACE_PICTURE) {
        await logger.error(
          `Error importing images from gallery to replace picture (index ${screenParams.replaceIndex}): "${errorMessage}"`,
          errorStack,
        )
      } else {
        await logger.error(
          `Error importing images from gallery to add pictures: "${errorMessage}"`,
          errorStack,
        )
      }

      setIsImporting(false)
      onError?.(errorInstance)
      showErrorImportingImagesAlert()
    }
  }, [
    assertParamsAreValidToImportImages,
    copyImagesToApp,
    replaceImage,
    goToPictureDetailScreen,
    addImages,
    goBack,
    logger,
    onError,
    showErrorImportingImagesAlert,
  ])


  const importSingleImage = useCallback(
    async (imageResource: ImageResource) => {
      const imageResources = [imageResource]
      await importImages(imageResources)
    },
    [importImages],
  )

  const importSelectedImages = useCallback(
    async () => {
      const imageResources = getSelectedImages()
      await importImages(imageResources)
    },
    [getSelectedImages, importImages],
  )


  const importImagesHook = useMemo<ImportImages>(() => ({
    isImporting,
    importSingleImage,
    importSelectedImages,
  }), [isImporting, importSingleImage, importSelectedImages])


  return importImagesHook
}
