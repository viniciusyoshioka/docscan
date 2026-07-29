import { BaseLogError } from './base-log.error.ts'


export class InvalidLogCodeError extends BaseLogError {


  readonly givenCode: unknown


  constructor(givenCode: unknown) {
    super(`Invalid log code provided: ${String(givenCode)}`)
    this.givenCode = givenCode
  }
}
