import { mockReactNative, mockReactNativeFs, mockReactNativeQuickSqlite } from "@mocks"


jest.mock("react-native", () => mockReactNative)
jest.mock("react-native-fs", () => mockReactNativeFs)
jest.mock("react-native-quick-sqlite", () => mockReactNativeQuickSqlite)


import { renderHook } from "@testing-library/react-hooks"
import { PropsWithChildren } from "react"

import { QuickSqliteDatabasesProvider } from "../../quick-sqlite"
import { ModelsProvider, useModels } from "../ModelsProvider"


describe("ModelsProvider", () => {
  it("should return the entity models", () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <QuickSqliteDatabasesProvider>
        <ModelsProvider>
          {children}
        </ModelsProvider>
      </QuickSqliteDatabasesProvider>
    )

    const { result } = renderHook(() => useModels(), { wrapper })

    expect(result.current.documentModel).toBeDefined()
    expect(result.current.pictureModel).toBeDefined()
    expect(result.current.logModel).toBeDefined()
  })
})
