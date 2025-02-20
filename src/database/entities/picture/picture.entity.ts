import { Column, Entity } from "typeorm"

import type { EntityId } from "../../types"
import { BaseEntity } from "../base-entity"


@Entity({ name: "pictures" })
export class PictureEntity extends BaseEntity {
  @Column({ name: "file_name", type: "text" })
  fileName!: string

  @Column({ name: "position", type: "int" })
  position!: number

  @Column({ name: "document_id", type: "uuid" })
  documentId!: EntityId
}
