import { useCallback } from "react"

import { useEntityModels } from "@database"
import { useDocumentState } from "@libs/document-state"


// TODO: Add isLoading state
export function useRenameDocument() {


  const { documentModel } = useEntityModels()
  const { documentState, updateDocumentState } = useDocumentState()


  const renameDocument = useCallback(async (newName: string) => {
    const documentId = documentState?.document.id
    if (!documentId) return

    const updatedDocument = await documentModel.updateDocumentName(documentId, newName)
    updateDocumentState({
      type: "renameDocument",
      payload: {
        document: updatedDocument,
      },
    })
  }, [documentState, documentModel, updateDocumentState])


  return renameDocument
}
