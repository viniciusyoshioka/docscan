import { useCallback } from 'react'
import Share from 'react-native-share'

import { Namespaces, useLocale } from '@locale'
import { useAlert } from '@modules/alert'
import { PathUtils } from '@modules/file-system'
import { Info } from '@modules/info'
import { stringifyError } from '@utils'


type ShareLogDatabase = () => Promise<void>


export function useShareLogDatabase(): ShareLogDatabase {


  const { t } = useLocale()
  const alert = useAlert()


  const shareLogDatabase = useCallback(async () => {
    try {
      const logDatabasePathWithFileProtocol = PathUtils.withFileProtocol(
        Info.databases.log.absolutePath,
      )

      await Share.open({
        type: 'application/x-sqlite3',
        url: logDatabasePathWithFileProtocol,
        failOnCancel: false,
      })
    } catch (error) {
      alert.show({
        title: t('warn'),
        description: t(
          'Settings_alert_errorSharingLogDatabase_text',
          { ns: Namespaces.APP },
        ),
      })

      // TODO: Add logger
      const errorMessage = stringifyError(error)
      console.error('[shareLogDatabase]', errorMessage)
    }
  }, [t, alert])


  return shareLogDatabase
}
