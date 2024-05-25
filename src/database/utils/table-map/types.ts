import { WithId } from "../../types"


export type TableMap<E> = {
  name: string
  col: {
    [K in keyof WithId<E>]: string
  }
}
