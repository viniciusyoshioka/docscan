import { mockReactNative, mockReactNativeFs, mockReactNativeQuickSqlite } from "@mocks"


jest.mock("react-native", () => mockReactNative)
jest.mock("react-native-fs", () => mockReactNativeFs)
jest.mock("react-native-quick-sqlite", () => mockReactNativeQuickSqlite)


import { renderHook } from "@testing-library/react-hooks"
import { PropsWithChildren } from "react"
import { Alert } from "react-native"

import {
  QuickSqliteDatabasesProvider,
  useQuickSqliteDatabases,
} from "../QuickSqliteDatabasesProvider"


describe("QuickSqliteDatabaseProvider", () => {
  it("should return the quick sqlite databases", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <QuickSqliteDatabasesProvider>
        {children}
      </QuickSqliteDatabasesProvider>
    )

    const { result } = renderHook(
      () => useQuickSqliteDatabases(),
      { wrapper }
    )

    expect(result.current.app).toBeDefined()
    expect(result.current.log).toBeDefined()
  })

  it("should show alert and not render children on error opening database", () => {
    jest
      .spyOn(require("react-native-quick-sqlite"), "open")
      .mockImplementation(() => {
        throw new Error("Invalid path")
      })

    const spyOnAlert = jest.spyOn(Alert, "alert")

    const wrapper = ({ children }: PropsWithChildren) => (
      <QuickSqliteDatabasesProvider>
        {children}
      </QuickSqliteDatabasesProvider>
    )

    const { result } = renderHook(
      () => useQuickSqliteDatabases(),
      { wrapper }
    )

    expect(spyOnAlert).toHaveBeenCalledTimes(1)
    expect(result.current).toBeUndefined()
  })
})
