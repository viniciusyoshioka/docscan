export function stringifyError(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof Error) {
    return error.message
  }

  const stringifiedObject = JSON.stringify(error)
  if (stringifiedObject === '{}') {
    return String(error)
  }
  return stringifiedObject
}
