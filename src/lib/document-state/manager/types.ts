import { SetOptional } from "type-fest"

import {
  Document,
  DocumentPicture,
  IDocumentModel,
  IDocumentPictureModel,
  IdOf,
  WithId,
} from "@database"
import { DocumentState } from "../useDocumentState"


export type DocumentManagerCommonActionParams = DocumentState & {
  documentModel: IDocumentModel
  documentPictureModel: IDocumentPictureModel
}


export type DocumentManagerBaseActionParams = {
  close: undefined
  open: {
    documentId: IdOf<Document>
  }
  updateDocument: {
    document: SetOptional<WithId<Document>, "id">
  }
  addPicture: {
    picturePath: string
  }
  addPictures: {
    picturesPath: string[]
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


export type DocumentManagerActionType = keyof DocumentManagerBaseActionParams


export type DocumentManagerActionFunction<T extends DocumentManagerActionType> = (
  commonParams: DocumentManagerCommonActionParams,
  specificParams: DocumentManagerBaseActionParams[T],
) => void


export type DocumentManagerActionMap = {
  [key in DocumentManagerActionType]: DocumentManagerActionFunction<key>
}
