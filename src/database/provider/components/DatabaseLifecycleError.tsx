import { Text } from 'react-native-paper'

import { FullScreenWarning } from '@components'
import { useHideSplashscreen } from '@hooks'
import { Namespaces, useLocale } from '@locale'
import type { DatabaseLifecycleResponse } from '../hooks'


function DatabaseInitializationError() {


  const { t } = useLocale()


  return (
    <FullScreenWarning>
      <Text
        variant={'bodyLarge'}
        style={{ width: '100%', textAlign: 'center' }}
      >
        {t(
          'database_initialization_error_title',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        {t(
          'database_initialization_error_description',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        &bull; {t(
          'database_initialization_error_description_option_1',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        &bull; {t(
          'database_initialization_error_description_option_2',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        &bull; {t(
          'database_initialization_error_description_option_3',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>
    </FullScreenWarning>
  )
}


function DatabaseMigrationError() {


  const { t } = useLocale()


  return (
    <FullScreenWarning>
      <Text
        variant={'bodyLarge'}
        style={{ width: '100%', textAlign: 'center' }}
      >
        {t(
          'database_migration_error_title',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        {t(
          'database_migration_error_description',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        &bull; {t(
          'database_migration_error_description_option_1',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        &bull; {t(
          'database_migration_error_description_option_2',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        &bull; {t(
          'database_migration_error_description_option_3',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>
    </FullScreenWarning>
  )
}


function DatabaseCloseError() {


  const { t } = useLocale()


  return (
    <FullScreenWarning>
      <Text
        variant={'bodyLarge'}
        style={{ width: '100%', textAlign: 'center' }}
      >
        {t(
          'database_close_error_title',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>

      <Text variant={'bodyMedium'}>
        {t(
          'database_close_error_description',
          { ns: Namespaces.INITIALIZATION },
        )}
      </Text>
    </FullScreenWarning>
  )
}


export function DatabaseLifecycleError(props: DatabaseLifecycleResponse) {


  useHideSplashscreen()


  const hasInitializationError = props.initializationErrors
  if (hasInitializationError) {
    console.error('Database initialization error:', props.initializationErrors)
    return <DatabaseInitializationError />
  }

  const hasMigrationError = props.migrationErrors
  if (hasMigrationError) {
    console.error('Database migration error:', props.migrationErrors)
    return <DatabaseMigrationError />
  }

  const hasCloseError = props.closeErrors
  if (hasCloseError) {
    console.error('Database close error:', props.closeErrors)
    return <DatabaseCloseError />
  }

  throw new Error('DatabaseLifecycleError called without error handling')
}
