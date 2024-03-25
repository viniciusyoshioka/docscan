import { createRealmContext } from "@realm/react"

import { Constants } from "@services/constant"
import { DocumentPictureRealmSchema, DocumentRealmSchema } from "../schemas"


const DocumentRealmContext = createRealmContext({
  schema: [DocumentRealmSchema, DocumentPictureRealmSchema],
  schemaVersion: 1,
  path: Constants.appDatabaseFullPath,
  deleteRealmIfMigrationNeeded: __DEV__,
})

export const {
  RealmProvider: DocumentRealmProvider,
  useRealm: useDocumentRealm,
  useObject: useDocumentObject,
  useQuery: useDocumentQuery,
} = DocumentRealmContext
