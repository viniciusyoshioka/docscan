import { Realm } from "@realm/react"


export const ExportedDocumentPictureSchema: Realm.ObjectSchema = {
  name: "ExportedDocumentPictureSchema",
  properties: {
    id: { type: "objectId", indexed: true, default: () => new Realm.BSON.ObjectId() },
    fileName: "string",
    position: "int",
    belongsTo: "objectId",
  },
  primaryKey: "id",
}
