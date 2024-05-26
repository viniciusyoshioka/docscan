jest.mock("react-native-fs", () => ({
  ExternalStorageDirectoryPath: "ExternalStorageDirectoryPath",
  DocumentDirectoryPath: "DocumentDirectoryPath",
}))

jest.mock("react-native-quick-sqlite", () => ({
  open: jest.fn(() => ({
    executeBatch: jest.fn(),
  })),
}))


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
