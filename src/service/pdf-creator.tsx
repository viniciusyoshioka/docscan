import { NativeModules } from "react-native"


const { PdfCreator } = NativeModules


export interface PdfCreatorProps {
    exportPicturesToPdf: (pictureList: Array<string>, documentPath: string | null) => Promise<ExportResponse>,
}


export interface ExportResponse {
    uri: string,
}


export default PdfCreator as PdfCreatorProps
