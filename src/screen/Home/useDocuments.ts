import { useState } from "react"

import { Document, WithId, useDatabase } from "@database"


// TODO add listener to update documents when database changes
export function useDocuments(): WithId<Document>[] {


  const { documentModel } = useDatabase()


  const [documents, setDocuments] = useState(getAllDocuments)


  function getAllDocuments() {
    return documentModel.selectAll({
      orderBy: {
        modifiedAt: "desc",
      },
    })
  }


  return documents
}
