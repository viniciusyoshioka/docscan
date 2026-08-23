import type { SetOptional } from 'type-fest'

import type { DocumentEntity, PictureEntity, PictureId } from '@database'


export type PersistedDocument = DocumentEntity

export type InMemoryDocument = SetOptional<
  DocumentEntity,
  'id' | 'createdAt' | 'updatedAt'
>

export type Document = InMemoryDocument | PersistedDocument

export type Picture = PictureEntity


type DocumentStateMethods = {
  closeDocument: () => void

  setDocument: (document: PersistedDocument, pictures?: Picture[]) => void

  setPictures: (pictures: Picture[]) => void
  addPictures: (pictures: Picture[], document: PersistedDocument) => void
  updatePicture: (picture: Picture, document: PersistedDocument) => void
  removePictures: (pictureIds: PictureId[], document: PersistedDocument) => void
}


export type DocumentState =
  | {
    document: null
    pictures: null
  } & DocumentStateMethods
  | {
    document: Document
    pictures: Picture[]
  } & DocumentStateMethods
