import { Realm } from "@realm/react"

import { useDocumentRealm } from "../configs"
import { DocumentSchema } from "../schemas"


// TODO update document list when screen is focused
// or when there is a change in the document list
export function useDocumentList(): Realm.Results<DocumentSchema> {


    const documentRealm = useDocumentRealm()


    return documentRealm
        .objects(DocumentSchema)
        .sorted("modifiedAt", true)
}
