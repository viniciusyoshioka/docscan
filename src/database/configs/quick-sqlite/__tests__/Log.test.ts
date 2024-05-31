import { mockReactNativeFs, mockReactNativeQuickSqlite } from "@mocks"


jest.mock("react-native-fs", () => mockReactNativeFs)
jest.mock("react-native-quick-sqlite", () => mockReactNativeQuickSqlite)


import { OpenDatabaseError } from "../../../errors"
import { createLogDatabase } from "../Log"


describe("createLogDatabase", () => {
  it("should create log database", () => {
    expect(() => createLogDatabase()).not.toThrow()
  })

  it("should throw OpenDatabaseError when passing invalid path", () => {
    jest
      .spyOn(require("react-native-quick-sqlite"), "open")
      .mockImplementation(() => {
        throw new Error("Invalid path")
      })

    try {
      createLogDatabase()
    } catch (error) {
      const { databaseName, message } = error as OpenDatabaseError

      expect(message).toBe("Failed to open QuickSqlite database: Invalid path")
      expect(databaseName).toBe("QuickSqlite")
    }
  })
})
