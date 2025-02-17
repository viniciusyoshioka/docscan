import { stringifyError } from "./stringify-error"


export function normalizeError(error: unknown): Error {
  const stringifiedError = stringifyError(error)
  return new Error(stringifiedError)
}
