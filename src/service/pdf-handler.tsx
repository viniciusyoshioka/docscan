import { Alert } from "react-native"

import { fullPathPdf } from "./constant"
import PdfCreator from "./pdf-creator"


export function createPdf(documentName: string, pictureList: Array<string>) {
    const documentPath = `${fullPathPdf}/${documentName}.pdf`
    PdfCreator.exportPicturesToPdf(documentPath, pictureList)
        .catch((error) => {
            console.log(error)
            Alert.alert(
                "Erro exportando PDF",
                `Mensagem de erro: "${error}"`
            )
        })
}
