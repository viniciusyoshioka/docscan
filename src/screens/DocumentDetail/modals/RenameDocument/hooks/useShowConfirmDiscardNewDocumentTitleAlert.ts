import { useCallback } from 'react'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'


type ShowConfirmDiscardNewDocumentTitleAlert = () => Promise<boolean>


export function useShowConfirmDiscardNewDocumentTitleAlert():
ShowConfirmDiscardNewDocumentTitleAlert {


  const alert = useAlert()
  const { t } = useLocale()


  const showConfirmDiscardNewDocumentTitleAlert =
    useCallback<ShowConfirmDiscardNewDocumentTitleAlert>(async () => {
      return await new Promise<boolean>((resolve, reject) => {
        alert.show({
          icon: 'alert-outline',
          title: t('warn'),
          description: t(
            'RenameDocument_alert_discardNewDocumentTitle_text',
            { ns: Namespaces.APP },
          ),
          buttons: [
            {
              label: t('no'),
              onPress: ({ dismiss }) => {
                dismiss()
                resolve(false)
              },
            },
            {
              label: t('yes'),
              onPress: ({ dismiss }) => {
                dismiss()
                resolve(true)
              },
            },
          ],
        })
      })
    }, [alert, t])


  return showConfirmDiscardNewDocumentTitleAlert
}
