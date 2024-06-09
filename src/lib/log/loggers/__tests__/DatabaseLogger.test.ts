import { mockReactNativeFs, mockReactNativeQuickSqlite } from "@mocks"


jest.mock("react-native-fs", () => mockReactNativeFs)
jest.mock("react-native-quick-sqlite", () => mockReactNativeQuickSqlite)


import { QuickSQLiteConnection } from "react-native-quick-sqlite"

import { LogModel } from "@database"
import { QuickSqliteProvider } from "@database/providers"
import { LogQuickSqliteRepository } from "@database/repositories"


describe("DatabaseLogger", () => {


  let mockDatabase: Record<string, jest.Mock>
  let model: LogModel


  beforeEach(() => {
    mockDatabase = {
      executeAsync: jest.fn(),
    }

    const provider = new QuickSqliteProvider(
      mockDatabase as unknown as QuickSQLiteConnection
    )
    const repository = new LogQuickSqliteRepository(provider)
    model = new LogModel(repository)
  })


  afterEach(() => {})


  it("", () => {

  })
})
