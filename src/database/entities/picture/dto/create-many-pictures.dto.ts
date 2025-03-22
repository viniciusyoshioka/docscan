import { EntityId } from "@database/types"


export class CreateManyPicturesDTO {
  fileNames!: string[]
  existingPicturesCount!: number
  documentId!: EntityId
}
