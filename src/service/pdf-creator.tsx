import { NativeModules } from "react-native"


const { PdfCreator } = NativeModules


export interface PdfCreatorProps {
    exportPicturesToPdf: (documentPath: string, pictureList: Array<string>) => Promise<boolean>,
}


export default PdfCreator as PdfCreatorProps
