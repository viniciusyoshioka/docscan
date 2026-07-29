import type { Logger } from '../logger.interface.ts'


export class MultipleLogger implements Logger {


  private readonly loggers: Logger[]


  constructor(...loggers: Logger[]) {
    this.loggers = loggers
  }


  addLogger(logger: Logger): void {
    this.loggers.push(logger)
  }


  async debug(message: string, stackTrace?: string): Promise<void> {
    for (let i = 0; i < this.loggers.length; i++) {
      const logger = this.loggers[i]
      await logger.debug(message, stackTrace)
    }
  }

  async info(message: string, stackTrace?: string): Promise<void> {
    for (let i = 0; i < this.loggers.length; i++) {
      const logger = this.loggers[i]
      await logger.info(message, stackTrace)
    }
  }

  async warn(message: string, stackTrace?: string): Promise<void> {
    for (let i = 0; i < this.loggers.length; i++) {
      const logger = this.loggers[i]
      await logger.warn(message, stackTrace)
    }
  }

  async error(message: string, stackTrace?: string): Promise<void> {
    for (let i = 0; i < this.loggers.length; i++) {
      const logger = this.loggers[i]
      await logger.error(message, stackTrace)
    }
  }
}
