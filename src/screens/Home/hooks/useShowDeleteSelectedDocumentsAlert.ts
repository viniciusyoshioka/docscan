import { useCallback } from 'react'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'


interface ShowDeleteSelectedDocumentsAlertParams {
  deleteSelectedDocuments: () => void
  exitSelection: () => void
}


type ShowDeleteSelectedDocumentsAlert = () => void


export function useShowDeleteSelectedDocumentsAlert(
  params: ShowDeleteSelectedDocumentsAlertParams,
): ShowDeleteSelectedDocumentsAlert {
  const { deleteSelectedDocuments, exitSelection } = params


  const alert = useAlert()
  const { t } = useLocale()


  const showDeleteSelectedDocumentsAlert =
    useCallback<ShowDeleteSelectedDocumentsAlert>(() => {
      alert.show({
        icon: 'trash-can-outline',
        title: t(
          'DeleteSelectedDocumentsModal_title',
          { ns: Namespaces.APP },
        ),
        description: t(
          'DeleteSelectedDocumentsModal_description',
          { ns: Namespaces.APP },
        ),
        buttons: [
          {
            label: t('cancel'),
            onPress: ({ dismiss }) => {
              dismiss()
            },
          },
          {
            label: t('delete'),
            onPress: ({ dismiss }) => {
              deleteSelectedDocuments()
              dismiss()
              exitSelection()
            },
          },
        ],
      })
    }, [alert, t, deleteSelectedDocuments, exitSelection])


  return showDeleteSelectedDocumentsAlert
}
