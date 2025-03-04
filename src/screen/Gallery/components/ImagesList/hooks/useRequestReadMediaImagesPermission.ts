import { useCallback } from "react"

import { getReadMediaImagesPermission } from "@services/permission"


type RequestReadMediaImagesPermission = () => Promise<boolean>


export function useRequestReadMediaImagesPermission(): RequestReadMediaImagesPermission {


  const requestPermission = useCallback(async (): Promise<boolean> => {
    const hasPermission = await getReadMediaImagesPermission()
    return hasPermission
  }, [])


  return requestPermission
}
