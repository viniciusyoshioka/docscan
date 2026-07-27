
export interface IsNumberOptions {
  allowNegative?: boolean
  allowPositive?: boolean
  allowZero?: boolean
  allowFloat?: boolean
  allowNaN?: boolean
  allowInfinite?: boolean
}


const defaultIsNumberOptions: IsNumberOptions = {
  allowNegative: false,
  allowPositive: false,
  allowZero: false,
  allowFloat: false,
  allowNaN: false,
  allowInfinite: false,
}


export function isNumber(
  value: unknown,
  options?: IsNumberOptions,
): boolean {
  const {
    allowNegative = defaultIsNumberOptions.allowNegative,
    allowPositive = defaultIsNumberOptions.allowPositive,
    allowZero = defaultIsNumberOptions.allowZero,
    allowFloat = defaultIsNumberOptions.allowFloat,
    allowNaN = defaultIsNumberOptions.allowNaN,
    allowInfinite = defaultIsNumberOptions.allowInfinite,
  } = options ?? {}

  const isNaN = Number.isNaN(value)
  const isInfinity = value === Infinity

  if (!allowNaN) {
    if (isNaN) return false
  }

  if (!allowInfinite) {
    if (isInfinity) return false
  }

  if (typeof value !== 'number') {
    return false
  }

  if (isNaN || isInfinity) {
    return true
  }

  if (!allowNegative) {
    const isNegative = value < 0
    if (isNegative) return false
  }

  if (!allowPositive) {
    const isPositive = value > 0
    if (isPositive) return false
  }

  if (!allowZero) {
    const isZero = value === 0
    if (isZero) return false
  }

  if (!allowFloat) {
    const isFloat = !Number.isInteger(value)
    if (isFloat) return false
  }

  return true
}
