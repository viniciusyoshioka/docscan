import { SetOptional, TaggedUnion } from "type-fest"

import { Document, Picture, WithId } from "@database"


export type DocumentStateData = {
  document: SetOptional<WithId<Document>, "id">
  pictures: WithId<Picture>[]
}


export type DocumentStateActionPayload = {
  close: undefined
  set: {
    document: WithId<Document>
    pictures: WithId<Picture>[]
  }
  updateDocument: {
    document: WithId<Document>
  }
  addPictures: {
    pictures: WithId<Picture>[]
  }
  removePicturesByIndex: {
    picturesIndex: number[]
  }
  updatePicture: {
    pictureIndex: number
    picture: WithId<Picture>
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
