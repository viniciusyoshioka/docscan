import type { EntityManager } from 'typeorm'

import { Transaction } from '../../database'


export class TypeOrmTransaction extends Transaction<EntityManager> {}
