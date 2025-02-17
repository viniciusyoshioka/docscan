import { EntityId } from "../../../types"
import { BaseDTO } from "../../base-dto"


export class PictureDTO extends BaseDTO {
  fileName!: string
  position!: number
  documentId!: EntityId
}
