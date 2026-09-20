import { useMemo } from 'react'

import { useDocumentState } from '@modules/document-state'
import { AbsolutePath, PathUtils } from '@modules/file-system'
import { Info } from '@modules/info'


export function useCurrentPicturePath(currentPictureIndex: number): string {


  const { document, pictures } = useDocumentState()


  const currentPictureAbsolutePath = useMemo(() => {
    if (!document) {
      // This hook should only be called when a document is open. If no
      // document is open, its not possible to visualize its pictures. So,
      // its expected that this condition never happens
      throw new Error('Document is not opened, this should not happen')
    }

    const currentPicture = pictures.at(currentPictureIndex)
    if (!currentPicture) {
      // This hook should only be called with a valid currentPictureIndex.
      // If the document has no pictures, its not possible to visualize a
      // picture that does not exists. So, its expected that this never happens.
      throw new Error('Invalid "currentPictureIndex", this should not happen')
    }

    const pictureAbsolutePath = new AbsolutePath([
      Info.folders.internal.pictures,
      currentPicture.fileName,
    ])

    return PathUtils.withFileProtocol(pictureAbsolutePath.absolutePath)
  }, [document, pictures, currentPictureIndex])


  return currentPictureAbsolutePath
}
