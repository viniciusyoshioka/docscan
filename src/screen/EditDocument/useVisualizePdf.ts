import RNFS from "react-native-fs"

import { DocumentStateData, useDocumentState } from "@lib/document-state"
import { DocumentService } from "@services/document"
import { PdfCreator } from "@services/pdf-creator"
import { getReadPermission } from "@services/permission"
import { FileNotExistsError, NoReadPermissionError } from "./errors"


export type VisualizePdfFunction = () => Promise<void>


export function useVisualizePdf(): VisualizePdfFunction {


  const { documentState } = useDocumentState()
  const { document } = documentState as DocumentStateData


  async function visualizePdf() {
    const hasPermission = await getReadPermission()
    if (!hasPermission) {
      throw new NoReadPermissionError()
    }

    const pdfFilePath = DocumentService.getPdfPath(document.name)

    const pdfFileExists = await RNFS.exists(pdfFilePath)
    if (!pdfFileExists) {
      throw new FileNotExistsError()
    }

    PdfCreator.viewPdf(pdfFilePath)
  }


  return visualizePdf
}
