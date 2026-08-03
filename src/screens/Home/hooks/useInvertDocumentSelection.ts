import { useCallback } from 'react'
import type { SelectionMode } from 'react-native-selection-mode'

import type { DocumentEntity, DocumentId } from '@database'


interface InvertDocumentSelectionParams {
  setSelectedData: SelectionMode<DocumentId>['setNewSelectedData']
  documents: DocumentEntity[]
}


type InvertDocumentSelection = () => void


// TODO: Instead of using the documents array to invert the selection,
// should use a `inverse` flag to indicate that the selection is inverted.
// When inverted, the selected documents are the ones that are not in the
// selectedData set. The reason this is needed is because the documents array
// may be infinite and paginated, making impossible to get all documents and
// invert the selection based on its id.
export function useInvertDocumentSelection(
  params: InvertDocumentSelectionParams,
): InvertDocumentSelection {
  const { setSelectedData, documents } = params


  const invertDocumentSelection = useCallback<InvertDocumentSelection>(() => {
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
