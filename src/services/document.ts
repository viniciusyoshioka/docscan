import RNFS from "react-native-fs"
import { v4 as uuid4 } from "uuid"

import { translate } from "../locales"
import { fullPathPicture, fullPathTemporaryExported } from "./constant"


export class DocumentService {

    static getNewName(): string {
        return translate("document_newDocumentName")
    }

    static getFileFullname(filePath: string): string {
        const splittedFilePath = filePath.split("/")
        return splittedFilePath[splittedFilePath.length - 1]
    }

    static getFileExtension(filePath: string): string {
        if (filePath.startsWith("."))
            return filePath

        const splittedFilePath = filePath.split(".")
        return splittedFilePath[splittedFilePath.length - 1]
    }

    static async getPicturePath(imagePath: string): Promise<string> {
        const fileExtension = this.getFileExtension(imagePath)

        let newPath: string
        do {
            const fileName = uuid4()
            newPath = `${fullPathPicture}/${fileName}.${fileExtension}`
        } while (await RNFS.exists(newPath))
        return newPath
    }

    static async getPictureTemporaryExportPath(imagePath: string): Promise<string> {
        const fileName = this.getFileFullname(imagePath)
        return `${fullPathTemporaryExported}/${fileName}`
    }
}
