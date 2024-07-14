import { SetOptional } from "type-fest"

import {
  Document,
  IDocumentModel,
  IPictureModel,
  IdOf,
  Picture,
  WithId,
} from "@database"


export type DocumentManagerCommonActionParams = {
  documentModel: IDocumentModel
  pictureModel: IPictureModel
}

export type DocumentManagerBaseActionParams = {
  open: {
    documentId: IdOf<Document>
  }
  updateDocument: {
    document: SetOptional<WithId<Document>, "id">
  }
  addPictures: {
    document: SetOptional<WithId<Document>, "id">
    picturesPath: string[]
  }
  removePictures: {
    document: WithId<Document>
    picturesId: IdOf<Picture>[]
  }
  updatePicture: {
    document: WithId<Document>
    picture: WithId<Picture>
  }
}

export type DocumentManagerActionReturnType = {
  open: {
    document: WithId<Document>
    pictures: WithId<Picture>[]
  }
  updateDocument: {
    document: WithId<Document>
  }
  addPictures: {
    document: WithId<Document>
    addedPictures: WithId<Picture>[]
  }
  removePictures: {
    document: WithId<Document>
  }
  updatePicture: {
    document: WithId<Document>
    updatedPicture: WithId<Picture>
  }
}


export type DocumentManagerActionType = keyof DocumentManagerBaseActionParams


export type DocumentManagerActionFunction<T extends DocumentManagerActionType> = (
  commonParams: DocumentManagerCommonActionParams,
  specificParams: DocumentManagerBaseActionParams[T],
) => Promise<DocumentManagerActionReturnType[T]>
