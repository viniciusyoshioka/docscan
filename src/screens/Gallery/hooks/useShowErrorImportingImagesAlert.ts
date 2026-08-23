import { useCallback } from 'react'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'


type ShowErrorImportingImagesAlert = () => void


export function useShowErrorImportingImagesAlert():
ShowErrorImportingImagesAlert {


  const alert = useAlert()
  const { t } = useLocale()


  const showErrorImportingImagesAlert =
    useCallback<ShowErrorImportingImagesAlert>(() => {
      alert.show({
        icon: 'alert-outline',
        title: t(
          'ErrorImportingImagesModal_title',
          { ns: Namespaces.APP },
        ),
        description: t(
          'ErrorImportingImagesModal_text',
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


  return showErrorImportingImagesAlert
}
