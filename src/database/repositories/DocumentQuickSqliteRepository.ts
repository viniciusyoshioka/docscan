import { QuickSQLiteConnection } from "react-native-quick-sqlite"

import { stringifyError } from "@utils"
import { Document } from "../entities"
import {
  BaseDatabaseError,
  EntityNotFoundError,
  InsertionError,
  UnknownDatabaseError,
} from "../errors"
import { QuickSqliteProvider } from "../providers"
import { QueryOptions, WithId } from "../types"
import { EntriesOfSorted, SortBy } from "../types/internal"
import { DocumentQuickSqliteTableMap } from "../utils"
import { DocumentRepository } from "./interfaces"


export class DocumentQuickSqliteRepository implements DocumentRepository {


  private database: QuickSQLiteConnection


  constructor(quickSqliteProvider: QuickSqliteProvider) {
    this.database = quickSqliteProvider.getDatabase()
  }


  async select(id: string): Promise<WithId<Document>> {
    try {
      const idNumber = Number(id)
      const { rows } = await this.database.executeAsync(`
        SELECT * FROM documents WHERE id = ?;
      `, [idNumber])

      if (!rows || rows.length === 0) {
        throw new EntityNotFoundError("Document", id)
      }

      const item = rows.item(0)
      return {
        id: String(item.id),
        ...item,
      }
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }

  async selectAll(options?: QueryOptions<Document>): Promise<WithId<Document>[]> {
    try {
      const orderBy = options?.orderBy ? this.createSorted(options.orderBy) : ""

      const { rows } = await this.database.executeAsync(`
        SELECT * FROM documents
        ${orderBy};
      `)


      if (!rows) return []

      return rows._array.map((item: WithId<Document>) => ({
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

  async insert(document: Document): Promise<WithId<Document>> {
    try {
      const { createdAt, updatedAt, name } = document
      const { insertId } = await this.database.executeAsync(`
        INSERT INTO documents (created_at, updated_at, name) VALUES (?, ?, ?);
      `, [createdAt, updatedAt, name])

      if (insertId === undefined) {
        throw new InsertionError("Document")
      }

      return {
        id: String(insertId),
        ...document,
      }
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }

  async update(document: WithId<Document>): Promise<WithId<Document>> {
    try {
      const { updatedAt, name, id } = document
      const idNumber = Number(id)

      await this.database.executeAsync(`
        UPDATE documents SET updated_at = ?, name = ? WHERE id = ?;
      `, [updatedAt, name, idNumber])

      return document
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
        DELETE FROM documents WHERE id = ?;
      `, [idNumber])
    } catch (error) {
      if (error instanceof BaseDatabaseError) {
        throw error
      }

      const stringifiedError = stringifyError(error)
      throw new UnknownDatabaseError(stringifiedError)
    }
  }


  protected createSorted(sortBy: SortBy<Document>): string {
    const statements: string[] = []

    const entries = Object.entries(sortBy) as EntriesOfSorted<Document>
    for (const [key, value] of entries) {
      if (value === undefined) {
        continue
      }

      const quickSqliteCol = DocumentQuickSqliteTableMap.col[key]
      statements.push(`${quickSqliteCol} ${value}`)
    }

    if (statements.length === 0) {
      return ""
    }
    return "ORDER BY " + statements.join(", ")
  }
}
