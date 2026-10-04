import { useCallback } from 'react'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { useLogger } from '@modules/logger'
import type { BasePermissionError } from '@modules/permission'


type ShowCameraPermissionErrorAlert = (error: BasePermissionError) => Promise<void>


export function useShowCameraPermissionErrorAlert(): ShowCameraPermissionErrorAlert {


  const alert = useAlert()
  const { t } = useLocale()
  const logger = useLogger()


  const showCameraPermissionErrorAlert = useCallback<ShowCameraPermissionErrorAlert>(
    async (error: BasePermissionError) => {
      alert.show({
        icon: 'alert-outline',
        title: t('error'),
        description: t(
          'Camera_alert_unexpectedErrorCheckingOrRequestingCameraPermission_text',
          { ns: Namespaces.APP },
        ),
      })

      const errorMessage = error.message
      const errorStack = error.stack

      await logger.error(
        `Unexpected and unknown error checking or requesting camera permission: "${errorMessage}"`,
        errorStack,
      )
    },
    [alert, t, logger],
  )


  return showCameraPermissionErrorAlert
}
