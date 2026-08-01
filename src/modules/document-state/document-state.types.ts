import type { DocumentEntity, PictureEntity, PictureId } from '@database'


type DocumentStateMethods = {
  closeDocument: () => void

  setDocument: (document: DocumentEntity) => void
  updateDocumentTitle: (newTitle: DocumentEntity['title']) => void

  setPictures: (pictures: PictureEntity[]) => void
  addPictures: (pictures: PictureEntity[]) => void
  removePictures: (pictureIds: PictureId[]) => void
}


export type DocumentState =
  | {
    document: null
    pictures: null
  } & DocumentStateMethods
  | {
    document: DocumentEntity
    pictures: PictureEntity[]
  } & DocumentStateMethods
