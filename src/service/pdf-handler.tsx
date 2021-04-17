import { fullPathPdf } from "./constant"
import PdfCreator from "./pdf-creator"


export async function createPdf(pictureList: Array<string>, documentName: string | null = null) {
    let documentPath: string | null
    if (documentName === null) {
        documentPath = null
    } else {
        documentPath = `${fullPathPdf}/${documentName}.pdf`
    }

    return await PdfCreator.exportPicturesToPdf(pictureList, documentPath)
}
