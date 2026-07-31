import { isNumber } from '@utils'


export function assertOffsetIsValid(offset?: number): void {
  if (typeof offset === 'undefined') return

  const isOffsetValid = isNumber(offset, {
    allowPositive: true,
  })
  if (!isOffsetValid) {
    throw new Error(`Invalid value for offset: "${offset}"`)
  }
}
