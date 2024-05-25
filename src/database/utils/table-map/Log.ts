import { Log } from "../../entities"
import { TableMap } from "./types"


export const LogQuickSqliteTableMap: TableMap<Log> = {
  name: "logs",
  col: {
    id: "id",
    code: "code",
    message: "message",
    timestamp: "timestamp",
  },
}
