import { QueryOptions, WithId } from "."


export type SortBy<T> = NonNullable<QueryOptions<WithId<T>>["orderBy"]>


export type EntriesOfSorted<T> = Array<[
  keyof WithId<T>,
  NonNullable<QueryOptions<WithId<T>>["orderBy"]>[keyof WithId<T>],
]>
