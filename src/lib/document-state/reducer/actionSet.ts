import { DocumentStateActionFunction } from "./types"


export const set: DocumentStateActionFunction<"set"> = (state, payload) => {
  return payload
}
