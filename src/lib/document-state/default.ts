import { SetOptional } from "type-fest"

import { Document, DocumentPicture, WithId } from "@database"


// TODO add internationalization for name property
export const defaultDocument: SetOptional<WithId<Document>, "id"> = {
  id: undefined,
  createdAt: Date.now(),
  modifiedAt: Date.now(),
  name: "Untitled Document",
}


export const defaultPictures: WithId<DocumentPicture>[] = []
