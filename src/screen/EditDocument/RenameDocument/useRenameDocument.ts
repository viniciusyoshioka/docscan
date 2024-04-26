import {
  DocumentStateData,
  useDocumentManager,
  useDocumentState,
} from "@lib/document-state"


export type RenameDocumentFunction = (newDocumentName: string) => void


export function useRenameDocument(): RenameDocumentFunction {


  const { documentState } = useDocumentState()
  const documentManager = useDocumentManager()

  const { document } = documentState as DocumentStateData


  function renameDocument(newDocumentName: string) {
    const newDocument = { ...document }
    newDocument.name = newDocumentName

    documentManager.updateDocument(newDocument)
  }


  return renameDocument
}
