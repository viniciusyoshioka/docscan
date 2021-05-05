import { Alert, NativeModules, ToastAndroid } from "react-native"
import RNFS from "react-native-fs"

import { fullPathPdf, pathPdf } from "./constant"
import { log } from "./log"


const PdfCreator: PdfCreatorProps = NativeModules.PdfCreator


interface PdfCreatorProps {
    exportPicturesToPdf: (pictureList: Array<string>, documentPath: string | null) => Promise<ExportResponse>,
}


export interface ExportResponse {
    uri: string,
}


export async function exportDocumentToPdf(documentName: string, pictureList: Array<string>) {
    if (documentName === "") {
        Alert.alert(
            "Nome do documento vazio",
            "Não é possível exportar documento sem nome"
        )
        return
    }

    if (pictureList.length === 0) {
        Alert.alert(
            "Documento sem fotos",
            "Não é possível exportar documento sem fotos"
        )
        return
    }

    const documentPath = `${fullPathPdf}/${documentName}.pdf`

    if (await RNFS.exists(documentPath)) {
        Alert.alert(
            "Exportação interrompida",
            "Arquivo com mesmo nome já existe"
        )
        return
    }

    PdfCreator.exportPicturesToPdf(pictureList, documentPath)
        .then((response: ExportResponse) => {
            if (response.uri.includes(fullPathPdf)) {
                ToastAndroid.show(`Documento exportado para "Memória Externa/${pathPdf}/${documentName}.pdf"`, 10)
                return
            }
            ToastAndroid.show(`Documento exportado para "${response.uri}"`, 10)
        })
        .catch((error) => {
            log("ERROR", `EditDocument exportDocumentToPdf - Erro ao export documento para PDF. Mensagem: "${error}"`)
            Alert.alert(
                "Erro ao exportar documento",
                "Não foi possível exportar documento para PDF"
            )
        })

    Alert.alert(
        "Aguarde",
        "Exportar documento pode demorar alguns segundos"
    )
}
