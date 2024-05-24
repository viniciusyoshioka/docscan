import { Log } from "../../../entities"
import { WithId } from "../../../types"
import { LogQuickSqliteTableMap } from "../Log"


describe("LogQuickSqliteTableMap", () => {
  it("should map table name correctly", () => {
    expect(LogQuickSqliteTableMap.name).toBe("logs")
  })

  it("should map column names correctly", () => {
    type QuickSqliteEntries = [keyof WithId<Log>, string][]

    const entries = Object.entries(LogQuickSqliteTableMap.col) as QuickSqliteEntries
    for (const [key, value] of entries) {
      switch (key) {
        case "id":
          expect(value).toBe("id")
          break
        case "code":
          expect(value).toBe("code")
          break
        case "message":
          expect(value).toBe("message")
          break
        case "timestamp":
          expect(value).toBe("timestamp")
          break
        default:
          throw new Error(`Log column not covered for quick sqlite: ${key}`)
      }
    }
  })
})
