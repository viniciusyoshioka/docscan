import { SetOptional } from "type-fest"

import { Document, Picture, WithId } from "@database"


// TODO add internationalization for name property
export function createDefaultDocumentState(): SetOptional<WithId<Document>, "id"> {
  return {
    id: undefined,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: "Untitled Document",
  }
}


export function createDefaultPicturesState(): WithId<Picture>[] {
  return []
}
