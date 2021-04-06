import { fullPathPdf } from "./constant"
import PdfCreator from "./pdf-creator"


export function createPdf(documentName: string, pictureList: Array<string>) {
    const documentPath = `${fullPathPdf}/${documentName}.pdf`
    try {
        PdfCreator.exportPicturesToPdf(documentPath, pictureList)
    } catch (error) {
        console.log(error)
    }
}
