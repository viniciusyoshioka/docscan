import { Alert, NativeModules } from "react-native"
import RNFS from "react-native-fs"

import { fullPathPdf } from "./constant"
import { log } from "./log"


const PdfCreatorNativeModule = NativeModules.PdfCreator


export type PdfOptions = {
    quality: number,
}


export const defaultPdfOptions: PdfOptions = {
    quality: 100,
}


export async function createPdf(documentName: string, pictureList: Array<string>, options: PdfOptions = defaultPdfOptions) {
    if (documentName === "") {
        Alert.alert(
            "Documento sem nome",
            "Não é possível converter um documento sem nome para PDF"
        )
        return
    }

    if (pictureList.length === 0) {
        Alert.alert(
            "Documento sem fotos",
            "Não é possível converter um documento sem fotos para PDF"
        )
        return
    }

    const documentPath = `${fullPathPdf}/${documentName}.pdf`

    if (await RNFS.exists(documentPath)) {
        try {
            await RNFS.unlink(documentPath)
        } catch (error) {
            log(
                "ERROR",
                `service/pdf-creator convertDocumentToPdf - Erro ao apagar arquivo PDF já existente com mesmo nome do documento a ser convertido. Mensagem: "${error}"`
            )
        }
    }

    PdfCreatorNativeModule.createPdf(pictureList, documentPath, options)
}
