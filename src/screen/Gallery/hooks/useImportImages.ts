import { useNavigation, useRoute } from "@react-navigation/native"
import { useCallback, useState } from "react"

import { useEntityModels } from "@database"
import { useDocumentState } from "@libs/document-state"
import { useLogger } from "@libs/logger"
import { NavigationProps, RouteProps } from "@router"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { normalizeError, PathUtils, PictureUtils, stringifyError } from "@utils"


interface ImportImagesParams {
  onError: (error: Error) => void
}


interface ImportImages {
  isImporting: boolean
  importImages: (imagesPath: string[]) => Promise<void>
}


export function useImportImages(params: ImportImagesParams): ImportImages {


  const navigation = useNavigation<NavigationProps<"Gallery">>()
  const route = useRoute<RouteProps<"Gallery">>()

  const logger = useLogger()
  const { documentModel, pictureModel } = useEntityModels()
  const { documentState, updateDocumentState } = useDocumentState()

  const [isImporting, setIsImporting] = useState(false)


  const copyImagesToApp = useCallback(async (imagesPath: string[]): Promise<string[]> => {
    const imagePathsToCopy: string[] = []
    const imagePathsToAdd: string[] = []

    for (let i = 0; i < imagesPath.length; i++) {
      const sourcePath = imagesPath[i]
      const destinationPath = await PictureUtils.getNewPicturePathWithSameExtension(sourcePath)

      imagePathsToCopy.push(sourcePath)
      imagePathsToCopy.push(destinationPath)

      imagePathsToAdd.push(destinationPath)
    }

    await createAllFolders()
    DocumentService.copyPicturesService({ pictures: imagePathsToCopy })
    return imagePathsToAdd
  }, [])

  const replaceImage = useCallback(async (imagePath: string) => {
    if (route.params.action !== "replace-picture") {
      throw new Error("Screen action isn't 'replace-picture'")
    }
    if (!documentState) {
      throw new Error("Cannot replace image if document is not open")
    }
    if (!documentState.document.id) {
      throw new Error("Cannot replace image if document is not saved")
    }

    const documentId = documentState.document.id
    const currentPicture = documentState.pictures[route.params.replaceIndex]
    const pictureNewFileName = PathUtils.getFileNameFromPath(imagePath)

    const data = await documentModel.transaction(async tx => {
      const updatedPicture = await pictureModel.updateFileName(
        currentPicture.id,
        pictureNewFileName,
        tx,
      )

      const updatedDocument = await documentModel.updateDocumentLastUpdateDate(
        documentId,
        tx,
      )

      return { updatedPicture, updatedDocument }
    })

    const previousPicturePath = PictureUtils.getPicturePathForFileName(currentPicture.fileName)
    DocumentService.deletePicturesService({
      pictures: [previousPicturePath],
    })

    updateDocumentState({
      type: "replacePicture",
      payload: {
        document: data.updatedDocument,
        picture: data.updatedPicture,
      },
    })
  }, [route, documentState, documentModel, pictureModel, updateDocumentState])

  const addImagesToExistingDocument = useCallback(async (imagesPath: string[]) => {
    const existingDocumentId = documentState?.document.id
    if (!existingDocumentId) {
      throw new Error("Cannot import images from gallery and add to a document that is not saved")
    }

    const data = await documentModel.transaction(async tx => {
      const picturesFileNames = imagesPath.map(PathUtils.getFileNameFromPath)

      const createdPictures = await pictureModel.createMany({
        createManyDto: {
          fileNames: picturesFileNames,
          existingPicturesCount: documentState.pictures.length,
          documentId: existingDocumentId,
        },
        transaction: tx,
      })


      const updatedDocument = await documentModel.updateDocumentLastUpdateDate(
        existingDocumentId,
        tx,
      )


      return { createdPictures, updatedDocument }
    })

    updateDocumentState({
      type: "addPictures",
      payload: {
        document: data.updatedDocument,
        pictures: data.createdPictures,
      },
    })
  }, [documentState, documentModel, pictureModel, updateDocumentState])

  const addImagesToNewDocument = useCallback(async (imagesPath: string[]) => {
    const documentName = documentState?.document.name ?? DocumentService.getNewName()

    const data = await documentModel.transaction(async tx => {
      const createdDocument = await documentModel.create({
        createDto: {
          name: documentName,
        },
        transaction: tx,
      })


      const picturesFileNames = imagesPath.map(PathUtils.getFileNameFromPath)

      const createdPictures = await pictureModel.createMany({
        createManyDto: {
          fileNames: picturesFileNames,
          existingPicturesCount: 0,
          documentId: createdDocument.id,
        },
        transaction: tx,
      })


      return { createdDocument, createdPictures }
    })

    updateDocumentState({
      type: "openDocument",
      payload: {
        document: data.createdDocument,
        picture: data.createdPictures,
      },
    })
  }, [documentState, documentModel, pictureModel, updateDocumentState])

  const addImages = useCallback(async (imagesPath: string[]) => {
    if (route.params.action === "replace-picture") {
      throw new Error("Screen action should not be 'replace-picture' when importing images from gallery")
    }

    const existingDocumentId = documentState?.document.id
    if (existingDocumentId) {
      await addImagesToExistingDocument(imagesPath)
    } else {
      await addImagesToNewDocument(imagesPath)
    }
  }, [route, documentState, addImagesToExistingDocument, addImagesToNewDocument])

  const importImages = useCallback(async (imagesPath: string[]) => {
    try {
      setIsImporting(true)

      if (route.params.action === "replace-picture" && imagesPath.length !== 1) {
        throw new Error(`Only one image can be imported from gallery when replacing a picture, trying to import ${imagesPath.length}`)
      }
      if (route.params.action !== "replace-picture" && !imagesPath.length) {
        throw new Error("One or more images must be imported from gallery when adding a picture")
      }

      const imagePathsCopiedToApp = await copyImagesToApp(imagesPath)

      if (route.params.action === "replace-picture") {
        await replaceImage(imagePathsCopiedToApp[0])
        setIsImporting(false)
        navigation.navigate("VisualizePicture", { pictureIndex: route.params.replaceIndex })
        return
      }

      await addImages(imagePathsCopiedToApp)
      setIsImporting(false)
      navigation.goBack()
    } catch (err) {
      const errorInstance = normalizeError(err)
      const errorMessage = stringifyError(err)

      setIsImporting(false)

      await logger.error(`Error importing images from gallery: ${errorMessage}`)
      params.onError(errorInstance)
    }
  }, [route, copyImagesToApp, replaceImage, addImages, logger, params.onError])


  return {
    isImporting,
    importImages,
  }
}
