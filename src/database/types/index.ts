export type WithId<T> = T & { id: string }

export type IdOf<T> = WithId<T>["id"]

export type QueryOptions<T> = {
  orderBy?: {
    [key in keyof T]?: "asc" | "desc"
  }
}
