import { Column, Entity } from "typeorm"

import { BaseEntity } from "../base-entity"


@Entity({ name: "documents" })
export class DocumentEntity extends BaseEntity {
  @Column({ name: "name", type: "text" })
  name!: string

  @Column({ name: "created_at", type: "text", default: () => "strftime('%Y-%m-%d %H:%M:%f', 'now')" })
  createdAt!: Date

  @Column({ name: "updated_at", type: "text", default: () => "strftime('%Y-%m-%d %H:%M:%f', 'now')" })
  updatedAt!: Date
}
