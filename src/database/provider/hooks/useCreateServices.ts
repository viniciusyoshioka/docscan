import { useCallback } from 'react'

import type { Repositories, Services } from '../../internal-types'
import { DocumentService, LogService, PictureService } from '../../services'


export function useCreateServices() {


  const createServices = useCallback((repositories: Repositories): Services => {
    const documentService = new DocumentService(repositories.documentRepository)
    const pictureService = new PictureService(repositories.pictureRepository)
    const logService = new LogService(repositories.logRepository)

    const services: Services = {
      documentService,
      pictureService,
      logService,
    }

    return services
  }, [])


  return createServices
}
