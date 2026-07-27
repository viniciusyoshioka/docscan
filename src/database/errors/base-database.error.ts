export class BaseDatabaseError extends Error {
  constructor(message?: string, stack?: string) {
    super(message)

    if (stack?.length) {
      this.stack = stack
    }
  }
}
