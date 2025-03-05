import { useRoute } from "@react-navigation/native"
import { useCallback, useState } from "react"

import { RouteProps } from "@router"
import { normalizeError } from "@utils"


interface ImportImagesParams {
  onError: (error: Error) => void
}


interface ImportImages {
  isImporting: boolean
  importImages: (imagesPath: string[]) => Promise<void>
}


// TODO: Add error handling
export function useImportImages(params: ImportImagesParams): ImportImages {


  const route = useRoute<RouteProps<"Gallery">>()

  const [isImporting, setIsImporting] = useState(false)


  const replaceImage = useCallback(async (imagePath: string) => {
    // TODO: Implement
  }, [])

  const addImages = useCallback(async (imagesPath: string[]) => {
    // TODO: Implement
  }, [])

  const importImages = useCallback(async (imagesPath: string[]) => {
    try {
      setIsImporting(true)

      if (route.params.action === "replace-picture") {
        if (imagesPath.length !== 1) {
          throw new Error(`Only one image can be imported when replacing a picture, ${imagesPath.length} were given`)
        }

        await replaceImage(imagesPath[0])
      } else {
        await addImages(imagesPath)
      }

      setIsImporting(false)
    } catch (err) {
      const errorInstance = normalizeError(err)

      setIsImporting(false)
      params.onError(errorInstance)
    }
  }, [route.params.action, replaceImage, addImages, params.onError])


  return {
    isImporting,
    importImages,
  }
}
