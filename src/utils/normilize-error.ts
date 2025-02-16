import { stringifyError } from "./stringify-error"


export function normilizeError(error: unknown): Error {
  const stringifiedError = stringifyError(error)
  return new Error(stringifiedError)
}
