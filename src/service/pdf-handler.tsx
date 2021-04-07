import { fullPathPdf } from "./constant"
import PdfCreator from "./pdf-creator"


export function createPdf(documentName: string, pictureList: Array<string>) {
    const documentPath = `${fullPathPdf}/${documentName}.pdf`
    PdfCreator.exportPicturesToPdf(documentPath, pictureList)
}
