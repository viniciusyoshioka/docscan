export function getErrorStackTrace(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack
  }
  return undefined
}
