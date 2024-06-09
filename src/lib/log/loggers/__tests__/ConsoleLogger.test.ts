import { mockReactNative, mockReactNativeFs, mockReactNativeQuickSqlite } from "@mocks"


jest.mock("react-native", () => mockReactNative)
jest.mock("react-native-fs", () => mockReactNativeFs)
jest.mock("react-native-quick-sqlite", () => mockReactNativeQuickSqlite)


import { StandardDateFormatter } from "@lib/date-formatter"
import { ConsoleLogger } from "../ConsoleLogger"


// TODO add tests for error on logging
describe("ConsoleLogger", () => {


  const standardDateFormatter = new StandardDateFormatter()
  const consoleLogger = new ConsoleLogger(standardDateFormatter)
  let debugSpy: jest.SpyInstance
  let infoSpy: jest.SpyInstance
  let warnSpy: jest.SpyInstance
  let errorSpy: jest.SpyInstance


  beforeEach(() => {
    debugSpy = jest.spyOn(consoleLogger, "debug")
    infoSpy = jest.spyOn(consoleLogger, "info")
    warnSpy = jest.spyOn(consoleLogger, "warn")
    errorSpy = jest.spyOn(consoleLogger, "error")
  })

  afterEach(() => {
    debugSpy.mockRestore()
    infoSpy.mockRestore()
    warnSpy.mockRestore()
    errorSpy.mockRestore()
  })


  it("should log debug message with correct color", () => {
    consoleLogger.debug("Debug message")
    expect(debugSpy).toHaveBeenCalledTimes(1)
    expect(debugSpy).toHaveBeenCalledWith("Debug message")
  })

  it("should log info message with correct color", () => {
    consoleLogger.info("Info message")
    expect(infoSpy).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledWith("Info message")
  })

  it("should log warn message with correct color", () => {
    consoleLogger.warn("Warn message")
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith("Warn message")
  })

  it("should log error message with correct color", () => {
    consoleLogger.error("Error message")
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith("Error message")
  })
})
