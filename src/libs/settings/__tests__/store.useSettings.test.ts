import { renderHook } from "@testing-library/react-hooks"

import { defaultSettings } from "../default"
import { useSettings } from "../store"


describe("useSettings", () => {
  it("should return the default state", () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual(defaultSettings)
    expect(typeof result.current.setSettings).toBe("function")
  })
})
