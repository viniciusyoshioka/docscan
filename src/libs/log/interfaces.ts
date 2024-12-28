export interface Logger {
  debug(message: string): void | Promise<void>
  info(message: string): void | Promise<void>
  warn(message: string): void | Promise<void>
  error(message: string): void | Promise<void>
}
