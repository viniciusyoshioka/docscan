import { isNumber } from '@utils'
import type { Pagination } from '../types'


export function assertPaginationIsValid(pagination: Pagination): void {
  const { page, limit } = pagination

  const isPageValid = isNumber(page, {
    allowPositive: true,
  })
  if (!isPageValid) {
    throw new Error(`Invalid value for page: "${page}"`)
  }

  const isLimitValid = isNumber(limit, {
    allowPositive: true,
    allowZero: true,
  })
  if (!isLimitValid) {
    throw new Error(`Invalid value for limit: "${limit}"`)
  }
}
