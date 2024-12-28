import { EntityId } from "@database/types"


export interface PictureEntity {
  id: EntityId
  fileName: string
  position: number
  belongsTo: EntityId
}
