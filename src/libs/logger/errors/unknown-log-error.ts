import { BaseLogError } from "./base-log-error"


export class UnknownLogError extends BaseLogError {
  constructor(message: string, option?: ErrorOptions) {
    super(message, option)
    this.name = UnknownLogError.name
  }
}
