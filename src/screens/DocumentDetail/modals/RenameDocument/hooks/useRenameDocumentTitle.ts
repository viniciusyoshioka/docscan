import { useMemo, useState } from 'react'

import { Namespaces, useLocale } from '@locale'
import { useDocumentState } from '@modules/document-state'


interface RenameDocumentTitle {
  newTitle: string
  setNewTitle: (newTitle: string) => void
  hasChangedTitle: boolean
}


export function useRenameDocumentTitle(): RenameDocumentTitle {


  const { t } = useLocale()
  const { document } = useDocumentState()


  const initialDocumentTitle = useMemo(() => (
    document?.title ?? t('document_newDocumentName', { ns: Namespaces.APP })
  ), [])

  const [newTitle, setNewTitle] = useState(initialDocumentTitle)
  const hasChangedTitle = newTitle !== initialDocumentTitle


  const renameDocumentTitle = useMemo(() => ({
    newTitle,
    setNewTitle,
    hasChangedTitle,
  }), [
    newTitle,
    setNewTitle,
    hasChangedTitle,
  ])


  return renameDocumentTitle
}
