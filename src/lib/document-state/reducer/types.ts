import { SetOptional, TaggedUnion } from "type-fest"

import { Document, DocumentPicture, WithId } from "@database"


export type DocumentStateData = {
  document: SetOptional<WithId<Document>, "id">
  pictures: WithId<DocumentPicture>[]
}


export type DocumentStateActionPayload = {
  createNewIfEmpty: undefined
  close: undefined
  set: {
    document: WithId<Document>
    pictures: WithId<DocumentPicture>[]
  }
  updateDocument: {
    document: WithId<Document>
  }
  addPicture: {
    picture: WithId<DocumentPicture>
  }
  addPictures: {
    pictures: WithId<DocumentPicture>[]
  }
  removePictureByIndex: {
    pictureIndex: number
  }
  removePicturesByIndex: {
    picturesIndex: number[]
  }
  updatePicture: {
    pictureIndex: number
    picture: WithId<DocumentPicture>
  }
}


export type DocumentStateActionType = keyof DocumentStateActionPayload


type ActionsRecord<K extends DocumentStateActionType> = {
  [key in K]: {
    payload: DocumentStateActionPayload[key]
  }
}

export type DocumentStateActions<
  K extends DocumentStateActionType = DocumentStateActionType,
> = TaggedUnion<"type", ActionsRecord<K>>


export type DocumentStateActionFunction<
  T extends DocumentStateActionType = DocumentStateActionType,
> = (
  state: DocumentStateData | null,
  payload: DocumentStateActions<T>["payload"]
) => DocumentStateData | null


export type DocumentStateActionsMap = {
  [key in DocumentStateActionType]: DocumentStateActionFunction<key>
}


export type DocumentStateReducer = (
  state: DocumentStateData | null,
  action: DocumentStateActions,
) => DocumentStateData | null
