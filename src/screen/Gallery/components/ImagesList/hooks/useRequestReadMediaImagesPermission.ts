import { useCallback } from "react"

import { useLogger } from "@libs/logger"
import { getReadMediaImagesPermission } from "@services/permission"


type RequestReadMediaImagesPermission = () => Promise<boolean>


export function useRequestReadMediaImagesPermission(): RequestReadMediaImagesPermission {


  const logger = useLogger()


  const requestPermission = useCallback(async (): Promise<boolean> => {
    const hasPermission = await getReadMediaImagesPermission()
    if (!hasPermission) {
      await logger.debug("'READ_MEDIA_IMAGES' permission denied")
    }

    return hasPermission
  }, [logger])


  return requestPermission
}
