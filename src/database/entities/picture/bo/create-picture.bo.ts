import { EntityId } from "@database/types"


export class CreatePictureBO {
  fileName!: string
  position!: number
  documentId!: EntityId
}
