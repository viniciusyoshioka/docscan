import { EntityId } from "@database/types"


export class CreatePictureDTO {
  fileName!: string
  position!: number
  documentId!: EntityId
}
