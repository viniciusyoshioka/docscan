import { Realm } from "@realm/react"


export const ExportedDocumentSchema: Realm.ObjectSchema = {
    name: "ExportedDocumentSchema",
    properties: {
        id: { type: "objectId", indexed: true, default: () => new Realm.BSON.ObjectId() },
        createdAt: { type: "int", default: Date.now },
        modifiedAt: { type: "int", default: Date.now },
        name: "string",
    },
    primaryKey: "id",
}
