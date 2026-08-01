import { useCallback } from 'react'
import type { SelectionMode } from 'react-native-selection-mode'

import type { DocumentEntity, DocumentId } from '@database'


interface InvertDocumentSelectionParams {
  setSelectedData: SelectionMode<DocumentId>['setNewSelectedData']
  documents: DocumentEntity[]
}


type InvertDocumentSelection = () => void


export function useInvertDocumentSelection(
  params: InvertDocumentSelectionParams,
): InvertDocumentSelection {
  const { setSelectedData, documents } = params


  const invertDocumentSelection = useCallback(() => {
    setSelectedData(currentSelectedData => {
      const newSelectedData = new Set<DocumentId>()

      for (let i = 0; i < documents.length; i++) {
        const document = documents[i]

        const isSelected = currentSelectedData.has(document.id)
        if (!isSelected) {
          newSelectedData.add(document.id)
        }
      }

      return newSelectedData
    })
  }, [setSelectedData, documents])


  return invertDocumentSelection
}
