import { EntityId } from "../../../types"


export class GetPicturesByDocumentIdPaginatedBO {
  documentId!: EntityId
  limit?: number
  offset?: number
}
