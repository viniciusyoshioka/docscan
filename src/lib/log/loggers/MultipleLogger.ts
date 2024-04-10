import { ILogger } from "../interfaces"


export class MultipleLogger implements ILogger {


  private loggers: ILogger[]


  constructor(...loggers: ILogger[]) {
    this.loggers = loggers
  }


  public addLogger(logger: ILogger): void {
    this.loggers.push(logger)
  }

  public debug(message: string): void {
    this.loggers.forEach(logger => logger.debug(message))
  }

  public info(message: string): void {
    this.loggers.forEach(logger => logger.info(message))
  }

  public warn(message: string): void {
    this.loggers.forEach(logger => logger.warn(message))
  }

  public error(message: string): void {
    this.loggers.forEach(logger => logger.error(message))
  }
}
