import RNFS from "react-native-fs"

import { DocumentStateData, useDocumentState } from "@lib/document-state"
import { DocumentService } from "@services/document"
import { getWritePermission } from "@services/permission"
import { NoWritePermissionError } from "./ConvertPdfOption/errors"
import { FileNotExistsError } from "./errors"


export type DeletePdfFunction = () => Promise<void>


export function useDeletePdf(): DeletePdfFunction {


  const { documentState } = useDocumentState()
  const { document } = documentState as DocumentStateData


  async function deletePdf() {
    const hasPermission = await getWritePermission()
    if (!hasPermission) {
      throw new NoWritePermissionError()
    }

    const pdfFilePath = DocumentService.getPdfPath(document.name)

    const pdfFileExists = await RNFS.exists(pdfFilePath)
    if (!pdfFileExists) {
      throw new FileNotExistsError()
    }

    await RNFS.unlink(pdfFilePath)
  }


  return deletePdf
}
