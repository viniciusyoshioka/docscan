import { EntityId } from "../../../types"


export class GetPicturesByDocumentIdPaginatedDTO {
  documentId!: EntityId
  limit?: number
  offset?: number
}
