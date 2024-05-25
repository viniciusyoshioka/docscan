import { Document } from "../../entities"
import { TableMap } from "./types"


export const DocumentQuickSqliteTableMap: TableMap<Document> = {
  name: "documents",
  col: {
    id: "id",
    createdAt: "created_at",
    updatedAt: "updated_at",
    name: "name",
  },
}
