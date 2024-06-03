import { LogCode } from "@database"


export class InvalidLogCodeError extends Error {


  private _givenCode: LogCode


  constructor(givenCode: LogCode, message?: string, options?: ErrorOptions) {
    const errorMessage = message ?? `Invalid log code provided: ${givenCode}`
    super(errorMessage, options)
    this.name = "InvalidLogCodeError"
    this._givenCode = givenCode
  }


  get givenCode(): LogCode {
    return this._givenCode
  }
}
