import { QuickSQLiteConnection } from "react-native-quick-sqlite"

import { stringifyError } from "@utils"
import { Document, Picture } from "../entities"
import {
  BaseDatabaseError,
  EntityNotFoundError,
  InsertionError,
  UnknownDatabaseError,
} from "../errors"
import { QuickSqliteProvider } from "../providers"
import { IdOf, QueryOptions, WithId } from "../types"
import { EntriesOfSorted, SortBy } from "../types/internal"
import { PictureQuickSqliteTableMap } from "../utils"
import { PictureRepository } from "./interfaces"


export class PictureQuickSqliteRepository implements PictureRepository {


  protected database: QuickSQLiteConnection


  constructor(quickSqliteProvider: QuickSqliteProvider) {
    this.database = quickSqliteProvider.getDatabase()
  }


  async count(documentId: IdOf<Document>): Promise<number> {
    try {
      const numberDocumentId = Number(documentId)

      const { rows } = await this.database.executeAsync(`
        SELECT COUNT(*) as total_pictures FROM pictures WHERE belongs_to = ?;  
      `, [numberDocumentId])

      if (!rows || rows.length === 0) {
        return 0
      }

      return rows.item(0).total_pictures as number
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }

  async select(id: string): Promise<WithId<Picture>> {
    try {
      const idNumber = Number(id)
      const { rows } = await this.database.executeAsync(`
        SELECT * FROM pictures WHERE id = ?;
      `, [idNumber])

      if (!rows || rows.length === 0) {
        throw new EntityNotFoundError("Picture", id)
      }

      const item = rows.item(0)
      return {
        ...item,
        id,
      }
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }

  async selectAllForDocument(
    documentId: string,
    options?: QueryOptions<Picture>
  ): Promise<WithId<Picture>[]> {
    try {
      const documentIdNumber = Number(documentId)
      const orderBy = options?.orderBy ? this.createSorted(options.orderBy) : ""

      const { rows } = await this.database.executeAsync(`
        SELECT * FROM pictures
        WHERE belongs_to = ?
        ${orderBy};
      `, [documentIdNumber])


      if (!rows) return []

      return rows._array.map((item: WithId<Picture>) => ({
        ...item,
        id: String(item.id),
      }))
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }

  async insert(picture: Picture): Promise<WithId<Picture>> {
    try {
      const { fileName, position, belongsTo } = picture
      const { insertId } = await this.database.executeAsync(`
        INSERT INTO pictures (file_name, position, belongs_to) VALUES (?, ?, ?);
      `, [fileName, position, belongsTo])

      if (insertId === undefined) {
        throw new InsertionError("Picture")
      }

      return {
        ...picture,
        id: String(insertId),
      }
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }

  async update(picture: WithId<Picture>): Promise<WithId<Picture>> {
    try {
      const { id, fileName, position, belongsTo } = picture
      const idNumber = Number(id)

      await this.database.executeAsync(`
        UPDATE pictures SET file_name = ?, position = ?, belongs_to = ? WHERE id = ?;
      `, [fileName, position, belongsTo, idNumber])

      return picture
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const idNumber = Number(id)

      await this.database.executeAsync(`
        DELETE FROM pictures WHERE id = ?;
      `, [idNumber])
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }


  protected createSorted(sortBy: SortBy<Picture>): string {
    const statements: string[] = []

    const entries = Object.entries(sortBy) as EntriesOfSorted<Picture>
    for (const [key, value] of entries) {
      if (value === undefined) {
        continue
      }

      const quickSqliteCol = PictureQuickSqliteTableMap.col[key]
      statements.push(`${quickSqliteCol} ${value}`)
    }

    if (statements.length === 0) {
      return ""
    }
    return "ORDER BY " + statements.join(", ")
  }
}
