import { Realm } from "@realm/react"

import { exportDatabaseFullPath } from "../../services/constant"
import { ExportedDocumentPictureSchema, ExportedDocumentSchema } from "../schemas"


export async function openExportedDatabase() {
    return await Realm.open({
        schema: [ExportedDocumentSchema, ExportedDocumentPictureSchema],
        schemaVersion: 1,
        path: exportDatabaseFullPath,
        deleteRealmIfMigrationNeeded: __DEV__,
    })
}
