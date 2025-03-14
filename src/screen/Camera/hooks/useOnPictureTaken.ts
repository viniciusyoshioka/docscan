import { useNavigation, useRoute } from "@react-navigation/native"
import { useCallback } from "react"

import { useEntityModels } from "@database"
import { useDocumentState } from "@libs/document-state"
import { translate } from "@locales"
import { NavigationProps, RouteProps } from "@router"
import { DocumentService } from "@services/document"
import { PathUtils, PictureUtils } from "@utils"


// TODO: Add error handling showing a modal with the error message
export function useOnPictureTaken() {


  const navigation = useNavigation<NavigationProps<"Camera">>()
  const { params } = useRoute<RouteProps<"Camera">>()

  const { documentState, updateDocumentState } = useDocumentState()
  const { documentModel, pictureModel } = useEntityModels()


  const replacePicture = useCallback(async (newPicturePath: string) => {
    if (params?.action !== "replace-picture") {
      throw new Error("Screen action is not 'replace-picture'")
    }
    if (!documentState) {
      throw new Error("Document is not open to replace picture")
    }
    if (!documentState.document.id) {
      throw new Error("Document is not saved to replace picture")
    }

    const existingDocumentId = documentState.document.id
    const oldPicture = documentState.pictures[params.replaceIndex]

    const data = await documentModel.transaction(async tx => {
      const updatedDocument = await documentModel.updateDocumentLastUpdateDate(
        existingDocumentId,
        tx,
      )
      const updatedPicture = await pictureModel.updateFileName(
        oldPicture.id,
        PathUtils.getFileNameFromPath(newPicturePath),
        tx,
      )

      return { updatedDocument, updatedPicture }
    })


    const { updatedDocument, updatedPicture } = data

    updateDocumentState({
      type: "addPictures",
      payload: {
        document: updatedDocument,
        pictures: [updatedPicture],
      },
    })

    DocumentService.deletePicturesService({
      pictures: [PictureUtils.getPicturePathForFileName(oldPicture.fileName)],
    })

    navigation.navigate("VisualizePicture", {
      pictureIndex: params.replaceIndex,
    })
  }, [params, documentState, documentModel, pictureModel, updateDocumentState, navigation])


  const addPicture = useCallback(async (newPicturePath: string) => {
    const data = await documentModel.transaction(async tx => {
      const existingDocumentId = documentState?.document.id

      const document = existingDocumentId
        ? await documentModel.updateDocumentLastUpdateDate(existingDocumentId, tx)
        : await documentModel.create({
          createDto: {
            name: translate("untitleDocument"),
          },
          transaction: tx,
        })

      const fileName = PathUtils.getFileNameFromPath(newPicturePath)
      const position = documentState?.pictures.length ?? 0
      const documentId = document.id

      const createdPicture = await pictureModel.create({
        createDto: { fileName, position, documentId },
        transaction: tx,
      })

      return { document, createdPicture }
    })


    updateDocumentState({
      type: "openDocument",
      payload: {
        document: data.document,
        picture: data.createdPicture,
      },
    })
  }, [documentModel, documentState, pictureModel, updateDocumentState])


  const onPictureTaken = useCallback(async (picturePath: string) => {
    if (params?.action === "replace-picture") {
      await replacePicture(picturePath)
    } else {
      await addPicture(picturePath)
    }
  }, [params, replacePicture, addPicture])


  return onPictureTaken
}
