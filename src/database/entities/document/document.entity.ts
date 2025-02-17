import { Column, Entity } from "typeorm"

import { BaseEntity } from "../base-entity"


@Entity({ name: "documents" })
export class DocumentEntity extends BaseEntity {
  @Column("text")
  name!: string

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date
}
