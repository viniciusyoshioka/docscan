import { mockReactNativeFs, mockReactNativeQuickSqlite } from "@mocks"


jest.mock("react-native-fs", () => mockReactNativeFs)
jest.mock("react-native-quick-sqlite", () => mockReactNativeQuickSqlite)


import { OpenDatabaseError } from "../../../errors"
import { createAppDatabase } from "../App"


describe("createAppDatabase", () => {
  it("should create app database", () => {
    expect(() => createAppDatabase()).not.toThrow()
  })

  it("should throw OpenDatabaseError when passing invalid path", () => {
    jest
      .spyOn(require("react-native-quick-sqlite"), "open")
      .mockImplementation(() => {
        throw new Error("Invalid path")
      })

    expect(() => createAppDatabase()).toThrow(OpenDatabaseError)
  })
})
