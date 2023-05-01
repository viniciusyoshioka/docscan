import { createRealmContext } from "@realm/react"

import { appRealmDatabaseFullPath } from "../../services/constant"
import { DocumentPictureSchema, DocumentSchema } from "../schemas"


const DocumentRealmContext = createRealmContext({
    schema: [DocumentSchema, DocumentPictureSchema],
    schemaVersion: 1,
    path: appRealmDatabaseFullPath,
    deleteRealmIfMigrationNeeded: __DEV__,
})

export const {
    RealmProvider: DocumentRealmProvider,
    useRealm: useDocumentRealm,
    useObject: useDocumentObject,
    useQuery: useDocumentQuery,
} = DocumentRealmContext
