import { Realm } from "@realm/react"


export interface ExportedDocumentPictureRealm {
    id: Realm.BSON.ObjectId
    fileName: string
    position: number
    belongsToDocument: Realm.BSON.ObjectId
}
