import { Realm } from "@realm/react"

import { ExportedDocumentPictureSchema, ExportedDocumentSchema } from "../schemas"


export async function openExportedDatabase(path: string) {
  return await Realm.open({
    schema: [ExportedDocumentSchema, ExportedDocumentPictureSchema],
    schemaVersion: 1,
    path,
    deleteRealmIfMigrationNeeded: __DEV__,
  })
}
