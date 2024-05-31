jest.mock("react-native-quick-sqlite", () => ({
  open: jest.fn().mockReturnValue({
    executeAsync: jest.fn()
      .mockImplementationOnce(() => ({
        insertId: 1,
      }))
      .mockImplementationOnce(() => ({
        insertId: undefined,
      }))
      .mockImplementationOnce(() => {
        throw new Error("Test SQLite internal error")
      }),
  }),
}))


import { open } from "react-native-quick-sqlite"

import { Log, LogCode } from "../../entities"
import { InsertionError, UnknownDatabaseError } from "../../errors"
import { QuickSqliteProvider } from "../../providers"
import { LogQuickSqliteRepository } from "../LogQuickSqliteRepository"


describe("LogQuickSqliteRepository", () => {


  const spyOnOpen = jest.spyOn(require("react-native-quick-sqlite"), "open")


  const database = open({ name: "test.sqlite" })
  const spyOnDatabase = jest.spyOn(database, "executeAsync")

  const quickSqliteProvider = new QuickSqliteProvider(database)
  const spyOnProvider = jest.spyOn(quickSqliteProvider, "getDatabase")

  const logRepository = new LogQuickSqliteRepository(quickSqliteProvider)
  const spyOnRepository = jest.spyOn(logRepository, "insert")


  it("should insert log", async () => {
    const log: Log = {
      code: LogCode.debug,
      message: "Test error message",
      timestamp: Date.now(),
    }


    await expect(logRepository.insert(log))
      .resolves
      .toEqual({ id: "1", ...log })
    expect(spyOnRepository).toHaveBeenCalledTimes(1)
    expect(spyOnRepository).toHaveBeenCalledWith(log)
    expect(spyOnProvider).toHaveBeenCalledTimes(1)
    expect(spyOnDatabase).toHaveBeenCalledTimes(1)
    expect(spyOnOpen).toHaveBeenCalledTimes(1)
  })

  it("should handle insertion failure", async () => {
    const log: Log = {
      code: LogCode.debug,
      message: "Test error message",
      timestamp: Date.now(),
    }


    await expect(logRepository.insert(log))
      .rejects
      .toThrow(new InsertionError("Log"))
    expect(spyOnRepository).toHaveBeenCalledTimes(2)
    expect(spyOnRepository).toHaveBeenCalledWith(log)
    expect(spyOnProvider).toHaveBeenCalledTimes(1)
    expect(spyOnDatabase).toHaveBeenCalledTimes(2)
    expect(spyOnOpen).toHaveBeenCalledTimes(1)
  })

  it("should handle error during insertion", async () => {
    const log: Log = {
      code: LogCode.debug,
      message: "Test error message",
      timestamp: Date.now(),
    }


    await expect(logRepository.insert(log))
      .rejects
      .toThrow(new UnknownDatabaseError("Test SQLite internal error"))
    expect(spyOnRepository).toHaveBeenCalledTimes(3)
    expect(spyOnRepository).toHaveBeenCalledWith(log)
    expect(spyOnProvider).toHaveBeenCalledTimes(1)
    expect(spyOnDatabase).toHaveBeenCalledTimes(3)
    expect(spyOnOpen).toHaveBeenCalledTimes(1)
  })
})
