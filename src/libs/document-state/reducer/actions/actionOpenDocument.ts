import { PictureDTO } from "@database"
import { DocumentAlreadyOpenError } from "../../errors"
import { DocumentStateActionFunction } from "../types"


export const openDocument: DocumentStateActionFunction<"openDocument"> = (state, payload) => {
  if (state) {
    throw new DocumentAlreadyOpenError("Cannot open document when another one is already opened")
  }

  const { document, picture } = payload
  const pictures: PictureDTO[] = picture ? [picture] : []

  return { document, pictures }
}
