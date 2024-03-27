export type WithId<T> = T & { id: string }

export type QueryOptions<T> = {
  orderBy?: {
    [key in keyof T]?: "asc" | "desc"
  }
}
