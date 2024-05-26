import { mockReactNative, mockReactNativeFs, mockReactNativeQuickSqlite } from "@mocks"


jest.mock("react-native", () => mockReactNative)
jest.mock("react-native-fs", () => mockReactNativeFs)
jest.mock("react-native-quick-sqlite", () => mockReactNativeQuickSqlite)


import { renderHook } from "@testing-library/react-hooks"
import { PropsWithChildren } from "react"

import { DatabaseProvider } from "../DatabaseProvider"
import { useModels } from "../models"
import { useQuickSqliteDatabases } from "../quick-sqlite"


describe("DatabaseProvider", () => {


  const wrapper = ({ children }: PropsWithChildren) => (
    <DatabaseProvider>
      {children}
    </DatabaseProvider>
  )

  const databasesHook = renderHook(() => useQuickSqliteDatabases(), { wrapper })
  const modelsHook = renderHook(() => useModels(), { wrapper })


  it("should return the database", () => {
    const { result } = databasesHook
    expect(result.current.app).toBeDefined()
    expect(result.current.log).toBeDefined()
  })

  it("should return the models", () => {
    const { result } = modelsHook
    expect(result.current.documentModel).toBeDefined()
    expect(result.current.pictureModel).toBeDefined()
    expect(result.current.logModel).toBeDefined()
  })
})
