import RNFS from "react-native-fs"

import { DocumentStateData, useDocumentState } from "@lib/document-state"
import { Constants } from "@services/constant"
import { DocumentService } from "@services/document"
import { createAllFolders } from "@services/folder-handler"
import { PdfCreator } from "@services/pdf-creator"
import { getWritePermission } from "@services/permission"
import { NoPicturesAvaialbleError, NoWritePermissionError } from "./errors"


export type ConvertToPdfFunction = (compression: number) => Promise<void>


export function useConvertToPdf(): ConvertToPdfFunction {


  const { documentState } = useDocumentState()
  const { document, pictures } = documentState as DocumentStateData


  async function convertToPdf(compression: number) {
    if (pictures.length === 0) {
      throw new NoPicturesAvaialbleError()
    }

    const hasPermission = await getWritePermission()
    if (!hasPermission) {
      throw new NoWritePermissionError()
    }

    const documentPath = DocumentService.getPdfPath(document.name)

    const pdfFileExists = await RNFS.exists(documentPath)
    if (pdfFileExists) {
      await RNFS.unlink(documentPath)
    }

    const pictureList = pictures.map(item => (
      DocumentService.getPicturePath(item.fileName)
    ))

    await createAllFolders()
    PdfCreator.createPdf(pictureList, documentPath, {
      imageCompressQuality: 100 - compression,
      temporaryPath: Constants.fullPathTemporaryCompressedPicture,
    })
  }


  return convertToPdf
}
