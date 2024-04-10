import { LogCode } from "@database"


export class InvalidLogCodeError extends Error {


  private givenCode: LogCode


  constructor(givenCode: LogCode, message?: string, options?: ErrorOptions) {
    const errorMessage = message ?? `Invalid log code provided: ${givenCode}`
    super(errorMessage, options)
    this.name = "InvalidLogCodeError"
    this.givenCode = givenCode
  }


  public getGivenCode(): LogCode {
    return this.givenCode
  }
}
