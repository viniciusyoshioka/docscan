import { NativeModules } from "react-native"


const PdfCreator = NativeModules.PdfCreator


/**
 * Object containg options for PDF conversion
 */
export type PdfCreatorOptions = {
    /**
     * Number from `0.0` to `1.0` indicating the
     * compression level aplied to the images.
     */
    imageCompressQuality: number;

    /**
     * Path to the temporary folder where images are
     * stored until the conversion is over
     */
    temporaryPath: string;
}


/**
 * Invokes a service to convert provided pictures to a PDF file
 *
 * @param pictureList string array of pictures paths to be converted
 * @param documentPath path to where the PDF file will be moved when the conversion is over
 * @param options `PdfCreatorOptions` object containing options for the conversion
 */
export function createPdf(pictureList: string[], documentPath: string, options: PdfCreatorOptions) {
    PdfCreator.createPdf(pictureList, documentPath, options)
}


/**
 * Open the provided PDF with native document viewer
 *
 * @param filePath string with PDF file path
 */
export function viewPdf(filePath: string) {
    PdfCreator.viewPdf(filePath)
}
