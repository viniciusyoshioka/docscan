export type ResultArray<T, E extends Error> =
  | [T, null]
  | [null, E]


export type Result<T, E extends Error> =
  | {
    data: T
    error: null
  }
  | {
    data: null
    error: E
  }
