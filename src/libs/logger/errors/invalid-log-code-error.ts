import { LogCode } from "@database"
import { BaseLogError } from "./base-log-error"


export class InvalidLogCodeError extends BaseLogError {


  readonly givenCode: LogCode


  constructor(givenCode: LogCode, options?: ErrorOptions) {
    const errorMessage = `Invalid log code provided: ${givenCode}`
    super(errorMessage, options)
    this.name = InvalidLogCodeError.name
    this.givenCode = givenCode
  }
}
