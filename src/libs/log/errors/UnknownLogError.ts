import { BaseLogError } from "./BaseLogError"


export class UnknownLogError extends BaseLogError {
  constructor(message: string, option?: ErrorOptions) {
    super(message, option)
    this.name = "UnknownLogError"
  }
}
