import type { Transaction } from '../database'


export interface BaseRepository {
  transaction<R = unknown>(
    runInTransaction: (tx: Transaction) => Promise<R>
  ): Promise<R>

  withinTransaction(transaction: Transaction): this
}
