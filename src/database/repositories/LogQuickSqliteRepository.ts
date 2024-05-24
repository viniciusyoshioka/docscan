import { QuickSQLiteConnection } from "react-native-quick-sqlite"

import { stringifyError } from "@utils"
import { Log } from "../entities"
import { BaseDatabaseError, InsertionError, UnknownDatabaseError } from "../errors"
import { QuickSqliteProvider } from "../providers"
import { WithId } from "../types"
import { LogRepository } from "./interfaces"


export class LogQuickSqliteRepository implements LogRepository {


  protected database: QuickSQLiteConnection


  constructor(quickSqliteProvider: QuickSqliteProvider) {
    this.database = quickSqliteProvider.getDatabase()
  }


  async insert(log: Log): Promise<WithId<Log>> {
    try {
      const { insertId } = this.database.execute(`
        INSERT INTO logs (code, message, timestamp) VALUES (?, ?, ?);
      `, [log.code, log.message, log.timestamp])

      if (insertId === undefined) {
        throw new InsertionError("Log")
      }

      return {
        ...log,
        id: String(insertId),
      }
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }
}
