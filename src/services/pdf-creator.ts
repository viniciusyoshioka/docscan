import { NativeModules } from "react-native"


const PdfCreator = NativeModules.PdfCreator


export type PdfCreatorOptions = {
    imageCompressQuality: number;
    temporaryPath: string;
}


export function createPdf(pictureList: Array<string>, documentPath: string, options: PdfCreatorOptions) {
    PdfCreator.createPdf(pictureList, documentPath, options)
}


export function viewPdf(filePath: string) {
    PdfCreator.viewPdf(filePath)
}
