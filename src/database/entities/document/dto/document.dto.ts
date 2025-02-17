import { BaseDTO } from "../../base-dto"


export class DocumentDTO extends BaseDTO {
  name!: string
  createdAt!: Date
  updatedAt!: Date
}
