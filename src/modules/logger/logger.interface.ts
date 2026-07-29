export interface Logger {
  debug(message: string, stackTrace?: string): void | Promise<void>
  info(message: string, stackTrace?: string): void | Promise<void>
  warn(message: string, stackTrace?: string): void | Promise<void>
  error(message: string, stackTrace?: string): void | Promise<void>
}
