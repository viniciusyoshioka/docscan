import { SetOptional, TaggedUnion } from "type-fest"

import { DocumentDTO, EntityId, PictureDTO } from "@database"


export type DocumentStateData = {
  document: SetOptional<DocumentDTO, "id">
  pictures: PictureDTO[]
}


type DocumentStateActionsPayload = {
  close: undefined

  openDocument: {
    document: DocumentDTO
    picture?: PictureDTO | PictureDTO[]
  }
  renameDocument: {
    document: DocumentDTO
  }

  setPictures: {
    pictures: PictureDTO[]
  }
  addPictures: {
    document: DocumentDTO
    pictures: PictureDTO[]
  }
  replacePicture: {
    document: DocumentDTO
    picture: PictureDTO
  }
  deletePictures: {
    document: DocumentDTO
    pictureIds: EntityId[]
  }
}


type DocumentStateAction = keyof DocumentStateActionsPayload


type ActionsRecord<K extends DocumentStateAction> = {
  [key in K]: {
    payload: DocumentStateActionsPayload[key]
  }
}

export type DocumentStateActions<
  K extends DocumentStateAction = DocumentStateAction,
> = TaggedUnion<"type", ActionsRecord<K>>


export type DocumentStateActionFunction<
  T extends DocumentStateAction = DocumentStateAction,
> = (
  state: DocumentStateData | null,
  payload: DocumentStateActions<T>["payload"]
) => DocumentStateData | null


export type DocumentStateActionsMap = {
  [key in DocumentStateAction]: DocumentStateActionFunction<key>
}


export type DocumentStateReducer = (
  state: DocumentStateData | null,
  action: DocumentStateActions,
) => DocumentStateData | null
