import { stringifyError } from './stringify-error.ts'


export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  const stringifiedError = stringifyError(error)
  return new Error(stringifiedError)
}
