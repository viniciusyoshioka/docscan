import { useCallback } from 'react'

import type { Repositories, Services } from '../../internal-types'
import { LogService } from '../../services'


export function useCreateServices() {


  const createServices = useCallback((repositories: Repositories): Services => {
    const logService = new LogService(repositories.logRepository)

    const services: Services = {
      logService,
    }

    return services
  }, [])


  return createServices
}
