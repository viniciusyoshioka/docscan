import { Alert, NativeModules } from "react-native"

import { getReadPermission } from "./permission"


interface PdfViewerProps {
    openPdf: (path: string) => void
}


const PdfViewer: PdfViewerProps = NativeModules.PdfViewer


export async function openPdf(path: string) {
    const hasPermission = await getReadPermission()
    if (!hasPermission) {
        Alert.alert(
            "Erro",
            "Sem permissão para visualizar PDF"
        )
        return
    }

    PdfViewer.openPdf(path)
}
