import { Alert, NativeModules, ToastAndroid } from "react-native"
import RNFS from "react-native-fs"

import { fullPathPdf, relativePathPdf } from "./constant"
import { log } from "./log"


const PdfCreator: PdfCreatorProps = NativeModules.PdfCreator


interface PdfCreatorProps {
    convertPicturesToPdf: (pictureList: Array<string>, documentPath: string | null) => Promise<ConvertResponse>,
}


export interface ConvertResponse {
    uri: string,
}


export async function convertDocumentToPdf(documentName: string, pictureList: Array<string>) {
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
        Alert.alert(
            "Conversão interrompida",
            "Arquivo com mesmo nome já existe"
        )
        return
    }

    PdfCreator.convertPicturesToPdf(pictureList, documentPath)
        .then((response: ConvertResponse) => {
            if (response.uri.includes(fullPathPdf)) {
                ToastAndroid.show(`Documento convertido para "Memória Externa/${relativePathPdf}/${documentName}.pdf"`, 10)
                return
            }
            ToastAndroid.show(`Documento convertido para "${response.uri}"`, 10)
        })
        .catch((error) => {
            log("ERROR", `service/pdf-creator convertDocumentToPdf - Erro ao converter documento para PDF. Mensagem: "${error}"`)
            Alert.alert(
                "Erro",
                "Erro desconhecido ao converter documento para PDF"
            )
        })

    Alert.alert(
        "Aguarde",
        "Converter documento para PDF pode demorar alguns segundos dependendo de seu tamanho"
    )
}
