import { NativeModules } from "react-native"


export interface PdfViewerProps {
    openPdf: (path: string) => void
}


const PdfViewer: PdfViewerProps = NativeModules.PdfViewer

export const openPdf = PdfViewer.openPdf
