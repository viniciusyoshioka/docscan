import type { Constructor } from 'type-fest'
import type { EntityManager, ObjectLiteral } from 'typeorm'
import { Repository } from 'typeorm'

import type { Transaction } from '../../database'
import type { BaseRepository } from '../../repositories'
import { TypeOrmTransaction } from '../database'


export class BaseTypeOrmRepository<E extends ObjectLiteral>
  extends Repository<E>
  implements BaseRepository {

  async transaction<T = unknown>(
    runInTransaction: (tx: Transaction<EntityManager>) => Promise<T>,
  ): Promise<T> {
    return await this.manager.transaction(async tx => {
      const typeormTransaction = new TypeOrmTransaction(tx)
      return await runInTransaction(typeormTransaction)
    })
  }

  withinTransaction(
    transaction: Transaction<EntityManager>,
  ): this {
    const thisRepositoryClass = this.constructor as Constructor<typeof this>

    const repositoryWithinTransaction = new thisRepositoryClass(
      this.target,
      transaction.underlyingContext,
    )

    return repositoryWithinTransaction
  }
}
