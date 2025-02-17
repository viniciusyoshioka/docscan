import { BaseDTO } from "../../base-dto"
import { LogCode } from "../log.constants"


export class LogDTO extends BaseDTO {
  code!: LogCode
  message!: string
  timestamp!: Date
}
