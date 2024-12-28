import { EntityId } from "@database/types"


export interface DocumentEntity {
  id: EntityId
  name: string
  createdAt: number
  updatedAt: number
}
