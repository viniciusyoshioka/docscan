import { useCallback, useEffect, useState } from 'react'

import type { Database, DatabaseErrors } from '../../database'
import type { Repositories } from '../../internal-types'


interface DatabaseLifecycleParams {
  database: Database<unknown>
  onRepositoriesCreated: (repositories: Repositories) => void
}


export interface DatabaseLifecycleResponse {
  initializationErrors: DatabaseErrors | null
  migrationErrors: DatabaseErrors | null
  closeErrors: DatabaseErrors | null
}


export function useDatabaseLifecycle(
  params: DatabaseLifecycleParams,
): DatabaseLifecycleResponse {
  const { database, onRepositoriesCreated } = params


  const [response, setResponse] = useState<DatabaseLifecycleResponse>({
    initializationErrors: null,
    migrationErrors: null,
    closeErrors: null,
  })


  const initialize = useCallback(async () => {
    const initializationErrors = await database.initialize()
    const hasSomeInitializationError = Object
      .values(initializationErrors)
      .some(initializationError => !!initializationError)

    if (hasSomeInitializationError) {
      setResponse(previousResponse => ({
        ...previousResponse,
        initializationErrors,
      }))
      return
    }

    const migrationErrors = await database.migrate()
    const hasSomeMigrationError = Object
      .values(migrationErrors)
      .some(migrationError => !!migrationError)

    if (hasSomeMigrationError) {
      setResponse(previousResponse => ({
        ...previousResponse,
        migrationErrors,
      }))
      return
    }

    const repositories = database.getRepositories()
    onRepositoriesCreated(repositories)
  }, [database, onRepositoriesCreated])


  const finalize = useCallback(async () => {
    const closeErrors = await database.close()
    const hasSomeCloseError = Object
      .values(closeErrors)
      .some(closeError => !!closeError)

    if (hasSomeCloseError) {
      setResponse(previousResponse => ({
        ...previousResponse,
        closeErrors,
      }))
    }
  }, [database])


  useEffect(() => {
    initialize()

    return () => {
      finalize()
    }
  }, [])


  return response
}
