import { NativeModules } from "react-native"


export type PdfCreatorOptions = {
    imageCompressQuality: number
    temporaryPath: string
}


export type PdfCreatorType = {
    createPdf: (pictureList: string[], documentPath: string, options: PdfCreatorOptions) => void
    viewPdf: (filePath: string) => Promise<void>
}


export const PdfCreator = NativeModules.PdfCreator as PdfCreatorType
