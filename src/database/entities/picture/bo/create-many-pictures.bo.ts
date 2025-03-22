import { EntityId } from "@database/types"


export class CreateManyPicturesBO {
  fileNames!: string[]
  existingPicturesCount!: number
  documentId!: EntityId
}
