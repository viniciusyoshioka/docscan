import { Realm } from "@realm/react"

import {
  ExportedDocumentPictureRealmSchema,
  ExportedDocumentRealmSchema,
} from "../schemas"


export async function openExportedDatabase(path: string) {
  return await Realm.open({
    schema: [ExportedDocumentRealmSchema, ExportedDocumentPictureRealmSchema],
    schemaVersion: 1,
    path,
    deleteRealmIfMigrationNeeded: __DEV__,
  })
}
