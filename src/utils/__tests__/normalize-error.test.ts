import { normalizeError } from '../normalize-error.ts'


describe('normalizeError', () => {
  it('should return the error when an Error instance is provided', () => {
    const error = new Error('The error instance with a message')

    const normalizedError = normalizeError(error)
    expect(normalizedError).toBe(error)
  })

  describe(
    'should stringify and set as the Error message when other type is provided',
    () => {
      it('string', () => {
        const errorAsString = 'Error as string'

        const normalizedError = normalizeError(errorAsString)
        expect(normalizedError).toBeInstanceOf(Error)
        expect(normalizedError.message).toBe(errorAsString)
      })

      it('number', () => {
        const errorAsNumber = 404

        const normalizedError = normalizeError(errorAsNumber)
        expect(normalizedError).toBeInstanceOf(Error)
        expect(normalizedError.message).toBe(String(errorAsNumber))
      })

      it('boolean', () => {
        const errorAsBoolean = true

        const normalizedError = normalizeError(errorAsBoolean)
        expect(normalizedError).toBeInstanceOf(Error)
        expect(normalizedError.message).toBe(String(errorAsBoolean))
      })

      it('undefined', () => {
        const errorAsUndefined = undefined

        const normalizedError = normalizeError(errorAsUndefined)
        expect(normalizedError).toBeInstanceOf(Error)
        expect(normalizedError.message).toBe('')
      })

      it('null', () => {
        const errorAsNull = null

        const normalizedError = normalizeError(errorAsNull)
        expect(normalizedError).toBeInstanceOf(Error)
        expect(normalizedError.message).toBe(String(errorAsNull))
      })
    },
  )
})
