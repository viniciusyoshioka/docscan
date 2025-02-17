import { Column, Entity } from "typeorm"

import type { EntityId } from "../../types"
import { BaseEntity } from "../base-entity"


@Entity({ name: "pictures" })
export class PictureEntity extends BaseEntity {
  @Column("text")
  fileName!: string

  @Column("int")
  position!: number

  @Column("uuid")
  documentId!: EntityId
}
