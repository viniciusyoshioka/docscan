import { useCallback } from 'react'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'


type ShowErrorDeletingSelectedDocumentsAlert = () => void


export function useShowErrorDeletingSelectedDocumentsAlert():
ShowErrorDeletingSelectedDocumentsAlert {


  const alert = useAlert()
  const { t } = useLocale()


  const showErrorDeletingSelectedDocumentsAlert =
    useCallback<ShowErrorDeletingSelectedDocumentsAlert>(() => {
      alert.show({
        icon: 'alert-outline',
        title: t(
          'ErrorDeletingSelectedDocumentsModal_title',
          { ns: Namespaces.APP },
        ),
        description: t(
          'ErrorDeletingSelectedDocumentsModal_description',
          { ns: Namespaces.APP },
        ),
        buttons: [
          {
            label: t('ok'),
            onPress: ({ dismiss }) => {
              dismiss()
            },
          },
        ],
      })
    }, [alert, t])


  return showErrorDeletingSelectedDocumentsAlert
}
