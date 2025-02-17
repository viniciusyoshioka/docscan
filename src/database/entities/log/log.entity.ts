import { Column, Entity } from "typeorm"

import { BaseEntity } from "../base-entity"
import { LogCode } from "./log.constants"


@Entity({ name: "logs" })
export class LogEntity extends BaseEntity {
  @Column("int")
  code!: LogCode

  @Column("text")
  message!: string

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  timestamp!: Date
}
