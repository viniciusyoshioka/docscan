import { NativeModules } from "react-native"

import { fullPathPdf } from "./constant"


const PdfCreator: PdfCreatorProps = NativeModules.PdfCreator


interface PdfCreatorProps {
    exportPicturesToPdf: (pictureList: Array<string>, documentPath: string | null) => Promise<ExportResponse>,
}


export interface ExportResponse {
    uri: string,
}


export async function createPdf(
    pictureList: Array<string>,
    documentName: string | null = null
): Promise<ExportResponse> {

    let documentPath: string | null = null
    if (documentName) {
        documentPath = `${fullPathPdf}/${documentName}.pdf`
    }

    return await PdfCreator.exportPicturesToPdf(pictureList, documentPath)
}
