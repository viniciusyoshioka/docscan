import { useCallback } from 'react'
import Share from 'react-native-share'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { PathUtils } from '@modules/file-system'
import { Info } from '@modules/info'
import { useLogger } from '@modules/logger'
import { getErrorStackTrace, stringifyError } from '@utils'


type ShareAppDatabase = () => Promise<void>


export function useShareAppDatabase(): ShareAppDatabase {


  const { t } = useLocale()
  const alert = useAlert()
  const logger = useLogger()


  const shareAppDatabase = useCallback(async () => {
    try {
      const appDatabasePathWithFileProtocol = PathUtils.withFileProtocol(
        Info.databases.app.absolutePath,
      )

      await Share.open({
        type: 'application/x-sqlite3',
        url: appDatabasePathWithFileProtocol,
        failOnCancel: false,
      })
    } catch (error) {
      alert.show({
        title: t('warn'),
        description: t(
          'Settings_alert_errorSharingAppDatabase_text',
          { ns: Namespaces.APP },
        ),
      })

      const errorMessage = stringifyError(error)
      const errorStack = getErrorStackTrace(error)
      await logger.error(
        `Error sharing app database file: "${errorMessage}"`,
        errorStack,
      )
    }
  }, [t, alert, logger])


  return shareAppDatabase
}
