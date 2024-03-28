import { Realm } from "@realm/react"


export const ExportedDocumentPictureRealmSchema: Realm.ObjectSchema = {
  name: "ExportedDocumentPictureRealmSchema",
  properties: {
    id: {
      type: "objectId",
      indexed: true,
      default: () => new Realm.BSON.ObjectId(),
    },
    fileName: "string",
    position: "int",
    belongsTo: "objectId",
  },
  primaryKey: "id",
}
