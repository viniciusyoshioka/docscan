import { getErrorStackTrace } from '../get-error-stack-trace.ts'


describe('getErrorStackTrace', () => {
  it('should return the stack trace of an Error object', () => {
    const error = new Error('Test error')
    const stackTrace = getErrorStackTrace(error)
    expect(stackTrace).toBeDefined()
    expect(stackTrace).toContain('Error: Test error')
  })

  it('should return undefined for non-Error objects', () => {
    const notAnError = { message: 'Not an error' }
    const stackTrace = getErrorStackTrace(notAnError)
    expect(stackTrace).toBeUndefined()
  })

  it('should return undefined for null and undefined', () => {
    expect(getErrorStackTrace(null)).toBeUndefined()
    expect(getErrorStackTrace(undefined)).toBeUndefined()
  })

  it('should return undefined for any other type', () => {
    expect(getErrorStackTrace('string')).toBeUndefined()
    expect(getErrorStackTrace(10)).toBeUndefined()
    expect(getErrorStackTrace(true)).toBeUndefined()
  })
})
