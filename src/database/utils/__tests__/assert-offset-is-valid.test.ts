import { assertOffsetIsValid } from '../assert-offset-is-valid.ts'


function buildOffsetErrorMessage(offset: number): string {
  return `Invalid value for offset: "${offset}"`
}


describe('assertOffsetIsValid', () => {
  it('should ignore and not throw when offset param is not provided', () => {
    const offset = undefined

    expect(
      () => assertOffsetIsValid(offset),
    ).not.toThrow()
  })

  it('should not throw when offset is positive', () => {
    const offset = 1

    expect(
      () => assertOffsetIsValid(offset),
    ).not.toThrow()
  })

  it('should throw when offset is negative', () => {
    const offset = -1

    expect(
      () => assertOffsetIsValid(offset),
    ).toThrow(buildOffsetErrorMessage(offset))
  })

  it('should throw when offset is zero', () => {
    const offset = 0

    expect(
      () => assertOffsetIsValid(offset),
    ).toThrow(buildOffsetErrorMessage(offset))
  })

  it('should throw when offset is decimal number', () => {
    const offset = 3.14

    expect(
      () => assertOffsetIsValid(offset),
    ).toThrow(buildOffsetErrorMessage(offset))
  })

  it('should throw when offset is NaN', () => {
    const offset = NaN

    expect(
      () => assertOffsetIsValid(offset),
    ).toThrow(buildOffsetErrorMessage(offset))
  })

  it('should throw when offset is Infinity', () => {
    const offset = Infinity

    expect(
      () => assertOffsetIsValid(offset),
    ).toThrow(buildOffsetErrorMessage(offset))
  })
})
