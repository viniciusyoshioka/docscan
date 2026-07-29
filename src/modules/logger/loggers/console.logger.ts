import { LogType } from '@database'
import type { StandardDateFormatter } from '@modules/date-formatter'
import { stringifyError } from '@utils'
import { InvalidLogCodeError, UnknownLogError } from '../errors'
import type { Logger } from '../logger.interface.ts'


type PrintOptions = {
  logType: LogType
  message: string
  stackTrace?: string
  color: string
}


export class ConsoleLogger implements Logger {


  private readonly dateFormatter: StandardDateFormatter
  private readonly resetColor = '\x1b[m'
  private readonly infoColor = '\x1b[96m'
  private readonly warnColor = '\x1b[93m'
  private readonly errorColor = '\x1b[97;41m'


  constructor(dateFormatter: StandardDateFormatter) {
    this.dateFormatter = dateFormatter
  }


  private print(options: PrintOptions) {
    const { logType, message, stackTrace, color } = options

    try {
      const datetime = this.dateFormatter.formatDateTime()
      const logTypeName = this.getLogTypeName(logType)

      if (stackTrace) {
        console.log(`${color}[${datetime}] ${logTypeName} - ${message}\n${stackTrace}${this.resetColor}`)
      } else {
        console.log(`${color}[${datetime}] ${logTypeName} - ${message}${this.resetColor}`)
      }
    } catch (error) {
      if (error instanceof InvalidLogCodeError) {
        throw error
      }
      const errorMessage = stringifyError(error)
      throw new UnknownLogError(errorMessage)
    }
  }


  debug(message: string, stackTrace?: string): void {
    this.print({
      logType: LogType.DEBUG,
      message,
      stackTrace,
      color: '',
    })
  }

  info(message: string, stackTrace?: string): void {
    this.print({
      logType: LogType.INFO,
      message,
      stackTrace,
      color: this.infoColor,
    })
  }

  warn(message: string, stackTrace?: string): void {
    this.print({
      logType: LogType.WARN,
      message,
      stackTrace,
      color: this.warnColor,
    })
  }

  error(message: string, stackTrace?: string): void {
    this.print({
      logType: LogType.ERROR,
      message,
      stackTrace,
      color: this.errorColor,
    })
  }


  private getLogTypeName(logType: LogType): string {
    switch (logType) {
      case LogType.DEBUG:
        return 'DEBUG'
      case LogType.INFO:
        return 'INFO'
      case LogType.WARN:
        return 'WARN'
      case LogType.ERROR:
        return 'ERROR'
      default:
        logType satisfies never
        throw new InvalidLogCodeError(logType)
    }
  }
}
