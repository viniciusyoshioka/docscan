import { QuickSQLiteConnection } from "react-native-quick-sqlite"


export interface IQuickSqliteProvider {
  getDatabase(): QuickSQLiteConnection
}
