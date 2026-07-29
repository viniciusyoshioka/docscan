import { stringifyError } from '../stringify-error.ts'


describe('stringifyError', () => {
  it('should return the same string when a string is provided', () => {
    const errorAsString = 'An unexpected error occurred'

    const stringifiedError = stringifyError(errorAsString)
    expect(stringifiedError).toBe(errorAsString)
  })

  it('should return the message when an Error instance is provided', () => {
    const errorMessage = 'Error message of Error instance'
    const errorAsError = new Error(errorMessage)

    const stringifiedError = stringifyError(errorAsError)
    expect(stringifiedError).toBe(errorMessage)
  })

  it('should return an equivalent string when an array is provided', () => {
    const arrayAsErrorMessage = [0, 1, 2, 3, 4]
    const stringifiedArrayAsErrorMessage = JSON.stringify(arrayAsErrorMessage)

    const stringifiedError = stringifyError(arrayAsErrorMessage)
    expect(stringifiedError).toBe(stringifiedArrayAsErrorMessage)
  })

  it('should return an equivalent string when an object is provided', () => {
    const objectAsErrorMessage = { key: 'value', otherKey: 1 }
    const stringifiedObjectAsErrorMessage = JSON.stringify(objectAsErrorMessage)

    const stringifiedError = stringifyError(objectAsErrorMessage)
    expect(stringifiedError).toBe(stringifiedObjectAsErrorMessage)
  })

  it('should handle when undefined is provided', () => {
    const stringifiedError = stringifyError(undefined)
    expect(stringifiedError).toBe(undefined)
  })

  it('should handle when null is provided', () => {
    const stringifiedError = stringifyError(null)
    expect(stringifiedError).toBe('null')
  })

  it('should handle when boolean is provided', () => {
    const stringifiedError = stringifyError(true)
    expect(stringifiedError).toBe('true')
  })

  it('should handle when a Set is provided', () => {
    const setAsErrorMessage = new Set<number>([0, 1, 2, 3, 4])
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const stringifiedSetAsErrorMessage = String(setAsErrorMessage)

    const stringifiedError = stringifyError(setAsErrorMessage)
    expect(stringifiedError).toBe(stringifiedSetAsErrorMessage)
  })
})
