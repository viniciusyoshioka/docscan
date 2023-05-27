import { Realm } from "@realm/react"

import { Document, DocumentPicture } from "../../interfaces"
import { DocumentPictureSchema, DocumentSchema } from "../../schemas"


export class DocumentModelConversor {
    static fromDocumentRealmToJson(document: DocumentSchema): Document {
        const documentJSON = document.toJSON() as unknown as Document
        documentJSON.id = document.id.toHexString()
        return documentJSON
    }

    static fromDocumentPictureRealmToJson(picture: DocumentPictureSchema): DocumentPicture {
        const pictureJSON = picture.toJSON() as unknown as DocumentPicture
        pictureJSON.id = picture.id.toHexString()
        pictureJSON.belongsToDocument = picture.belongsToDocument.toHexString()
        return pictureJSON
    }

    static fromDocumentPicturesRealmToJson(pictures: Realm.Results<DocumentPictureSchema>): DocumentPicture[] {
        return pictures.map(picture => {
            const pictureJSON = picture.toJSON() as unknown as DocumentPicture
            pictureJSON.id = picture.id.toHexString()
            pictureJSON.belongsToDocument = picture.belongsToDocument.toHexString()
            return pictureJSON
        })
    }
}
