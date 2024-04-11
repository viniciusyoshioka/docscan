import { Realm } from "@realm/react"
import { useEffect, useState } from "react"
import { CollectionChangeCallback } from "realm"

import { DocumentRealmSchema, useDocumentRealm } from "@database"


type DocumentsChanges = CollectionChangeCallback<
  DocumentRealmSchema,
  [number, DocumentRealmSchema]
>


export function useDocuments(): Realm.Results<DocumentRealmSchema> {


  const documentRealm = useDocumentRealm()
  const documentSchemas = documentRealm
    .objects(DocumentRealmSchema)
    .sorted("modifiedAt", true)

  const [documents, setDocuments] = useState(documentSchemas)


  const onChange: DocumentsChanges = (_, changes) => {
    const hasDeletion = changes.deletions.length > 0
    const hasInsertion = changes.insertions.length > 0
    const hasNewModifications = changes.newModifications.length > 0
    const hasOldModifications = changes.oldModifications.length > 0

    if (hasDeletion || hasInsertion || hasNewModifications || hasOldModifications) {
      const newDocuments = documentRealm
        .objects(DocumentRealmSchema)
        .sorted("modifiedAt", true)
      setDocuments(newDocuments)
    }
  }


  useEffect(() => {
    documentSchemas.addListener(onChange)

    return () => documentSchemas.removeListener(onChange)
  })


  return documents
}
