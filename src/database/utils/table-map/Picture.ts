import { Picture } from "../../entities"
import { TableMap } from "./types"


export const PictureQuickSqliteTableMap: TableMap<Picture> = {
  name: "pictures",
  col: {
    id: "id",
    fileName: "file_name",
    position: "position",
    belongsTo: "belongs_to",
  },
}
