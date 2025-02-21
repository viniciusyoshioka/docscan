import { useCallback } from "react"
import { SelectionMode } from "react-native-selection-mode"

import { DocumentDTO, EntityId } from "@database"


interface InvertDocumentSelectionParams {
  setSelectedData: SelectionMode<EntityId>["setNewSelectedData"]
  documents: DocumentDTO[]
}


export function useInvertDocumentSelection(params: InvertDocumentSelectionParams): () => void {
  const { setSelectedData, documents } = params


  const invertDocumentSelection = useCallback(() => {
    setSelectedData(currentSelectedData => {
      const newSelectedData = new Set<EntityId>()

      documents.forEach(document => {
        if (!currentSelectedData.has(document.id)) {
          newSelectedData.add(document.id)
        }
      })

      return newSelectedData
    })
  }, [setSelectedData, documents])


  return invertDocumentSelection
}
