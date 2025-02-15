import { LogCode } from "@database"
import { StandardDateFormatter } from "@libs/date-formatter"
import { stringifyError } from "@utils"
import { InvalidLogCodeError, UnknownLogError } from "../errors"
import { Logger } from "../interfaces"


type PrintOptions = {
  logCode: LogCode
  message: string
  color: string
}


export class ConsoleLogger implements Logger {


  private readonly dateFormatter: StandardDateFormatter
  private readonly resetColor = "\x1b[m"
  private readonly infoColor = "\x1b[96m"
  private readonly warnColor = "\x1b[93m"
  private readonly errorColor = "\x1b[97;41m"


  constructor(dateFormatter: StandardDateFormatter) {
    this.dateFormatter = dateFormatter
  }


  private print(options: PrintOptions) {
    const { logCode, message, color } = options

    try {
      const datetime = this.dateFormatter.formatDateTime()
      const code = this.getCodeName(logCode)

      console.log(`${color}[${datetime}] ${code} - ${message}${this.resetColor}`)
    } catch (error) {
      if (error instanceof InvalidLogCodeError) {
        throw error
      }
      const errorMessage = stringifyError(error)
      throw new UnknownLogError(errorMessage)
    }
  }


  debug(message: string): void {
    this.print({
      logCode: LogCode.debug,
      message,
      color: "",
    })
  }

  info(message: string): void {
    this.print({
      logCode: LogCode.info,
      message,
      color: this.infoColor,
    })
  }

  warn(message: string): void {
    this.print({
      logCode: LogCode.warn,
      message,
      color: this.warnColor,
    })
  }

  error(message: string): void {
    this.print({
      logCode: LogCode.error,
      message,
      color: this.errorColor,
    })
  }


  private getCodeName(code: LogCode): string {
    switch (code) {
      case LogCode.debug:
        return "DEBUG"
      case LogCode.info:
        return "INFO"
      case LogCode.warn:
        return "WARN"
      case LogCode.error:
        return "ERROR"
      default:
        throw new InvalidLogCodeError(code)
    }
  }
}
