import { QuickSQLiteConnection } from "react-native-quick-sqlite"

import { IQuickSqliteProvider } from "./interfaces"


export class QuickSqliteProvider implements IQuickSqliteProvider {


  private database: QuickSQLiteConnection


  constructor(database: QuickSQLiteConnection) {
    this.database = database
  }


  getDatabase(): QuickSQLiteConnection {
    return this.database
  }
}
