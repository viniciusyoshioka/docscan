import RNFS from "react-native-fs"
import Share from "react-native-share"

import { DocumentStateData, useDocumentState } from "@lib/document-state"
import { translate } from "@locales"
import { DocumentService } from "@services/document"
import { FileNotExistsError } from "./errors"


export type ShareDocumentPdfFunction = () => Promise<void>


export function useShareDocumentPdf(): ShareDocumentPdfFunction {


  const { documentState } = useDocumentState()
  const { document } = documentState as DocumentStateData


  async function shareDocumentPdf() {
    const documentPath = DocumentService.getPdfPath(document.name)

    const pdfFileExists = await RNFS.exists(documentPath)
    if (!pdfFileExists) {
      throw new FileNotExistsError()
    }

    await Share.open({
      title: translate("EditDocument_shareDocument"),
      type: "pdf/application",
      url: `file://${documentPath}`,
      failOnCancel: false,
    })
  }


  return shareDocumentPdf
}
