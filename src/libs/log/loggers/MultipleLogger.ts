import { Logger } from "../interfaces"


export class MultipleLogger implements Logger {


  private loggers: Logger[]


  constructor(...loggers: Logger[]) {
    this.loggers = loggers ?? []
  }


  addLogger(logger: Logger): void {
    this.loggers.push(logger)
  }

  debug(message: string): void {
    this.loggers.forEach(async logger => await logger.debug(message))
  }

  info(message: string): void {
    this.loggers.forEach(async logger => await logger.info(message))
  }

  warn(message: string): void {
    this.loggers.forEach(async logger => await logger.warn(message))
  }

  error(message: string): void {
    this.loggers.forEach(async logger => await logger.error(message))
  }
}
