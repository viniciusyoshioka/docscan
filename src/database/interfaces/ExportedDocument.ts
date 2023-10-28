import { Realm } from "@realm/react"


export interface ExportedDocumentRealm {
    id: Realm.BSON.ObjectId
    createdAt: number
    modifiedAt: number
    name: string
}
