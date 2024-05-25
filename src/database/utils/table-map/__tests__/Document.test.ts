import { Document } from "../../../entities"
import { WithId } from "../../../types"
import { DocumentQuickSqliteTableMap } from "../Document"


describe("DocumentQuickSqliteTableMap", () => {
  it("should map table name correctly", () => {
    expect(DocumentQuickSqliteTableMap.name).toBe("documents")
  })

  it("should map column names correctly", () => {
    type QuickSqliteEntries = [keyof WithId<Document>, string][]

    const entries = Object.entries(DocumentQuickSqliteTableMap.col) as QuickSqliteEntries
    for (const [key, value] of entries) {
      switch (key) {
        case "id":
          expect(value).toBe("id")
          break
        case "createdAt":
          expect(value).toBe("created_at")
          break
        case "updatedAt":
          expect(value).toBe("updated_at")
          break
        case "name":
          expect(value).toBe("name")
          break
        default:
          throw new Error(`Document column not covered for quick sqlite: ${key}`)
      }
    }
  })
})
