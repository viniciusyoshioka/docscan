
export interface Pagination {
  page?: number
  limit?: number
}


export interface Paginated<T> {
  data: T[]
  total: number
}
