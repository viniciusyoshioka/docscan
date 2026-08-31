import { useCallback } from 'react'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useDocumentState } from '@modules/document-state'
import { useGoBack } from './useGoBack.ts'


type ConvertDocumentToPdf = () => Promise<void>


export function useConvertDocumentToPdf(): ConvertDocumentToPdf {


  const alert = useAlert()
  const { t } = useLocale()
  const { document, pictures } = useDocumentState()

  const goBack = useGoBack()


  const showCannotConvertDocumentWithoutPicturesAlert = useCallback(() => {
    alert.show({
      icon: 'alert-outline',
      title: t('warn'),
      description: t(
        'ConvertDocumentToPdf_alert_documentWithoutPictures_text',
        { ns: Namespaces.APP },
      ),
    })
  }, [alert, t])


  // eslint-disable-next-line @typescript-eslint/require-await
  const convertDocumentToPdf = useCallback(async () => {
    if (!document?.id) return

    if (!pictures.length) {
      showCannotConvertDocumentWithoutPicturesAlert()
      return
    }

    // TODO: Implement document conversion to pdf

    goBack()
  }, [
    document,
    pictures,
    showCannotConvertDocumentWithoutPicturesAlert,
    goBack,
  ])


  return convertDocumentToPdf
}
