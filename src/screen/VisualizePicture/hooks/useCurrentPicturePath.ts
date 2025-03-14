import { useDocumentState } from "@libs/document-state"
import { PictureUtils } from "@utils"


export function useCurrentPicturePath(currentIndex: number): string {


  const { documentState } = useDocumentState()


  if (!documentState) {
    throw new Error("Document is not opened")
  }

  const currentPicture = documentState.pictures[currentIndex]
  return PictureUtils.getPicturePathForFileName(currentPicture.fileName)
}
