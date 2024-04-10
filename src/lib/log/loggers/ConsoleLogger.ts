import { LogCode } from "@database"
import { StandardDateFormatter } from "@lib/date-formatter"
import { stringifyError } from "@utils"
import { InvalidLogCodeError, UnknowLogError } from "../errors"
import { ILogger } from "../interfaces"


type PrintOptions = {
  logCode: LogCode
  message: string
  color: string
}


export class ConsoleLogger implements ILogger {


  private dateFormatter: StandardDateFormatter
  private resetColor = "\x1b[m"
  private infoColor = "\x1b[96m"
  private warnColor = "\x1b[93m"
  private errorColor = "\x1b[97;41m"


  constructor(dateFormatter: StandardDateFormatter) {
    this.dateFormatter = dateFormatter
  }


  private print(options: PrintOptions) {
    const { logCode, message, color } = options

    const datetime = this.dateFormatter.formatDateTime()
    const code = this.getCodeName(logCode)

    console.log(`${color}[${datetime}] ${code} - ${message}${this.resetColor}`)
  }


  public debug(message: string): void {
    try {
      this.print({
        logCode: LogCode.debug,
        message,
        color: "",
      })
    } catch (error) {
      if (error instanceof InvalidLogCodeError) {
        throw error
      }
      const errorMessage = stringifyError(error)
      throw new UnknowLogError(errorMessage)
    }
  }

  public info(message: string): void {
    try {
      this.print({
        logCode: LogCode.info,
        message,
        color: this.infoColor,
      })
    } catch (error) {
      if (error instanceof InvalidLogCodeError) {
        throw error
      }
      const errorMessage = stringifyError(error)
      throw new UnknowLogError(errorMessage)
    }
  }

  public warn(message: string): void {
    try {
      this.print({
        logCode: LogCode.warn,
        message,
        color: this.warnColor,
      })
    } catch (error) {
      if (error instanceof InvalidLogCodeError) {
        throw error
      }
      const errorMessage = stringifyError(error)
      throw new UnknowLogError(errorMessage)
    }
  }

  public error(message: string): void {
    try {
      this.print({
        logCode: LogCode.error,
        message,
        color: this.errorColor,
      })
    } catch (error) {
      if (error instanceof InvalidLogCodeError) {
        throw error
      }
      const errorMessage = stringifyError(error)
      throw new UnknowLogError(errorMessage)
    }
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
