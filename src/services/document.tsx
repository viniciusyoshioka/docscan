import RNFS from "react-native-fs"
import "react-native-get-random-values"
import { v4 as uuid4 } from "uuid"

import { translate } from "../locales"
import { fullPathPicture, fullPathTemporaryExported } from "./constant"


/**
 * Gets the default name of a new document
 *
 * @returns a string with the default name of the new document
 */
export function getDocumentName(): string {
    return translate("document_newDocumentName")
}


/**
 * Get the file name with the extension from a file path
 *
 * @param filePath string of the file path
 *
 * @returns string of the full file name
 */
export function getFullFileName(filePath: string): string {
    const splittedFilePath = filePath.split("/")
    return splittedFilePath[splittedFilePath.length - 1]
}


/**
 * Get the extenstion of the given file name or file path
 *
 * @param filePath string of the file name or file path
 *
 * @returns string of the file extension
 */
export function getFileExtension(filePath: string): string {
    const splittedFilePath = filePath.split(".")
    return splittedFilePath[splittedFilePath.length - 1]
}


/**
 * Get a new path for an image. The file will be
 * in the pictures folder and renamed using UUID v4
 *
 * @param imagePath string with image file name or path
 *
 * @returns string of the new image path
 */
export async function getDocumentPicturePath(imagePath: string): Promise<string> {
    const fileName = uuid4()
    const fileExtension = getFileExtension(imagePath)

    let newPath = `${fullPathPicture}/${fileName}.${fileExtension}`
    while (await RNFS.exists(newPath)) {
        const newFileName = uuid4()
        newPath = `${fullPathPicture}/${newFileName}.${fileExtension}`
    }
    return newPath
}


/**
 * Get the path for an exported document picture. The file
 * will be in the temporary exported folder.
 *
 * @param imagePath string with image file path
 *
 * @returns string of the new image path
 */
export async function getPictureTemporaryExportPath(imagePath: string): Promise<string> {
    const fileName = getFullFileName(imagePath)

    return `${fullPathTemporaryExported}/${fileName}`
}
