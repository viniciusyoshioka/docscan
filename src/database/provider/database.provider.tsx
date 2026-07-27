import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import type { Database } from '../database'
import type { Repositories, Services } from '../internal-types'
import { DatabaseLifecycleError } from './components'
import { useCreateServices, useDatabaseLifecycle } from './hooks'


const DatabaseContext = createContext<Services | null>(null)


export interface DatabaseProviderProps extends PropsWithChildren {
  database: Database<unknown>
}


export function DatabaseProvider(props: DatabaseProviderProps) {
  const { database } = props


  const [services, setServices] = useState<Services | null>(null)


  const createServices = useCreateServices()

  const onRepositoriesCreated = useCallback((repositories: Repositories) => {
    const createdServices = createServices(repositories)
    setServices(createdServices)
  }, [createServices])


  const databaseLifecycleParams = useMemo(() => ({
    database,
    onRepositoriesCreated,
  }), [database, onRepositoriesCreated])

  const databaseLifecycleResponse = useDatabaseLifecycle(
    databaseLifecycleParams,
  )


  const hasSomeError = databaseLifecycleResponse.initializationErrors
    || databaseLifecycleResponse.migrationErrors
    || databaseLifecycleResponse.closeErrors

  if (hasSomeError) {
    return (
      <DatabaseLifecycleError
        initializationErrors={databaseLifecycleResponse.initializationErrors}
        migrationErrors={databaseLifecycleResponse.migrationErrors}
        closeErrors={databaseLifecycleResponse.closeErrors}
      />
    )
  }


  if (!services) {
    return null
  }


  return (
    <DatabaseContext.Provider value={services}>
      {props.children}
    </DatabaseContext.Provider>
  )
}


export function useServices() {
  const services = useContext(DatabaseContext)

  if (!services) {
    throw new Error(
      'No value returned for useServices. Probably DatabaseProvider is missing',
    )
  }

  return services
}
