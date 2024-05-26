import { mockReactNative, mockReactNativeFs, mockReactNativeQuickSqlite } from "src/mocks"


jest.mock("react-native", () => mockReactNative)
jest.mock("react-native-fs", () => mockReactNativeFs)
jest.mock("react-native-quick-sqlite", () => mockReactNativeQuickSqlite)


import { renderHook } from "@testing-library/react-hooks"
import { PropsWithChildren } from "react"

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
})
