
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}


export type SortBy<T> = {
  [K in keyof T]?: SortOrder
}
