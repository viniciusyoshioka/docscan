import { RefObject, useRef, useState } from "react"
import { Alert } from "react-native"
import RNFS from "react-native-fs"

import { EntityId, useEntityModels } from "@database"
import { useDocumentState } from "@libs/document-state"
import { useLogger } from "@libs/logger"
import { translate } from "@locales"
import { PictureUtils, stringifyError } from "@utils"
import { ImageRotationRef } from "../components"


interface RotateImage {
  imageRotationRef: RefObject<ImageRotationRef>
  isRotating: boolean
  openRotation: () => void
  exitRotation: () => void
  saveRotatedImage: () => void
  rotateLeft: () => void
  rotateRight: () => void
}


export function useRotateImage(currentIndex: number): RotateImage {


  const logger = useLogger()
  const { documentModel, pictureModel } = useEntityModels()
  const { documentState, updateDocumentState } = useDocumentState()

  const imageRotationRef = useRef<ImageRotationRef>(null)

  const [isRotating, setIsRotating] = useState(false)
  const [isProcessingRotation, setIsProcessingRotation] = useState(false)


  function openRotation() {
    setIsRotating(true)
  }

  function exitRotation() {
    if (isProcessingRotation) return
    setIsRotating(false)
  }

  function rotateLeft() {
    if (!imageRotationRef.current) return
    if (isProcessingRotation) return

    imageRotationRef.current.rotateLeft()
  }

  function rotateRight() {
    if (!imageRotationRef.current) return
    if (isProcessingRotation) return

    imageRotationRef.current.rotateRight()
  }

  async function updateRotatedPicture(pictureId: EntityId, rotatedFilePath: string) {
    const documentId = documentState?.document.id as string

    const data = await pictureModel.transaction(async tx => {
      const updatedPicture = await pictureModel.updateFileName(pictureId, rotatedFilePath, tx)
      const updatedDocument = await documentModel.updateDocumentLastUpdateDate(documentId, tx)
      return { updatedPicture, updatedDocument }
    })

    updateDocumentState({
      type: "replacePicture",
      payload: {
        document: data.updatedDocument,
        picture: data.updatedPicture,
      },
    })
  }

  async function saveRotatedImage() {
    if (!imageRotationRef.current) return
    if (isProcessingRotation) return
    if (!documentState) throw new Error("Cannot rotate picture if document is not opened")

    const rotatedDegrees = imageRotationRef.current.getRotationDegree()
    if (rotatedDegrees % 360 === 0) {
      setIsRotating(false)
      setIsProcessingRotation(false)
      return
    }

    setIsProcessingRotation(true)
    const currentPicture = documentState.pictures[currentIndex]
    const originalPicturePath = PictureUtils.getPicturePathForFileName(currentPicture.fileName)

    try {
      const rotatedPicturePath = await PictureUtils.getNewPicturePathWithSameExtension(
        currentPicture.fileName,
      )

      await imageRotationRef.current.save(rotatedPicturePath)
      await updateRotatedPicture(currentPicture.id, rotatedPicturePath)

      setIsRotating(false)
      setIsProcessingRotation(false)
    } catch (error) {
      setIsRotating(false)
      setIsProcessingRotation(false)

      Alert.alert(
        translate("warn"),
        translate("VisualizePicture_alert_errorSavingRotatedImage_text"),
      )

      const errorMessage = stringifyError(error)
      await logger.error(`Error saving rotated picture: "${errorMessage}"`)
    }

    RNFS.unlink(originalPicturePath)
      .catch(async (error: unknown) => {
        const errorMessage = stringifyError(error)
        await logger.debug(`Error deleting original picture after rotation: "${errorMessage}"`)
      })
  }


  return {
    imageRotationRef,
    isRotating,
    openRotation,
    exitRotation,
    saveRotatedImage,
    rotateLeft,
    rotateRight,
  }
}
