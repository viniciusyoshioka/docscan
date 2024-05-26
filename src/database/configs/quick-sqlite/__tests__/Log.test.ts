jest.mock("react-native-fs", () => ({
  ExternalStorageDirectoryPath: "ExternalStorageDirectoryPath",
  DocumentDirectoryPath: "DocumentDirectoryPath",
}))

jest.mock("react-native-quick-sqlite", () => ({
  open: jest.fn(() => ({
    execute: jest.fn(),
  })),
}))


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

    expect(() => createLogDatabase()).toThrow(OpenDatabaseError)
  })
})
