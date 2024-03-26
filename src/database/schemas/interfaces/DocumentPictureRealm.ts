import { Realm } from "@realm/react"


export interface IDocumentPictureRealmSchema {
  id: Realm.BSON.ObjectId
  fileName: string
  position: number
  belongsToDocument: Realm.BSON.ObjectId
}