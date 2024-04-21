import { defaultDocument, defaultPictures } from "../default"
import { DocumentStateActionFunction } from "./types"


export const createNewIfEmpty: DocumentStateActionFunction<"createNewIfEmpty"> =
  (state, payload) => {
    if (state) return state

    return {
      document: defaultDocument,
      pictures: defaultPictures,
    }
  }
