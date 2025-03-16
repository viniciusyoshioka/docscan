import { Column, Entity } from "typeorm"

import { BaseEntity } from "../base-entity"
import { LogCode } from "./log.constants"


@Entity({ name: "logs" })
export class LogEntity extends BaseEntity {
  @Column({ name: "code", type: "int" })
  code!: LogCode

  @Column({ name: "message", type: "text" })
  message!: string

  @Column({ name: "timestamp", type: "text", default: () => "strftime('%Y-%m-%d %H:%M:%f', 'now')" })
  timestamp!: Date
}
