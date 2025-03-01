import { useCallback } from "react"


export function useOnPictureTaken() {


  const replacePicture = useCallback((newPicturePath: string) => {}, [])

  const addPicture = useCallback((newPicturePath: string) => {}, [])

  const onPictureTaken = useCallback(async (picturePath: string) => {}, [])


  return onPictureTaken
}
