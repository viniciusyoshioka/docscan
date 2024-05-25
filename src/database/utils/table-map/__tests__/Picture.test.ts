import { Picture } from "../../../entities"
import { WithId } from "../../../types"
import { PictureQuickSqliteTableMap } from "../Picture"


describe("PictureQuickSqliteTableMap", () => {
  it("should map table name correctly", () => {
    expect(PictureQuickSqliteTableMap.name).toBe("pictures")
  })

  it("should map column names correctly", () => {
    type QuickSqliteEntries = [keyof WithId<Picture>, string][]

    const entries = Object.entries(PictureQuickSqliteTableMap.col) as QuickSqliteEntries
    for (const [key, value] of entries) {
      switch (key) {
        case "id":
          expect(value).toBe("id")
          break
        case "fileName":
          expect(value).toBe("file_name")
          break
        case "position":
          expect(value).toBe("position")
          break
        case "belongsTo":
          expect(value).toBe("belongs_to")
          break
        default:
          throw new Error(`Picture column not covered for quick sqlite: ${key}`)
      }
    }
  })
})
