import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import type { LogEntity, LogId, LogType } from '../../entities'


@Entity({ name: 'logs' })
export class TypeOrmLogEntity implements LogEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: LogId

  @Column({ name: 'type', type: 'text', nullable: false })
  type!: LogType

  @Column({ name: 'timestamp', type: 'integer', nullable: false })
  timestamp!: number

  @Column({ name: 'message', type: 'text', nullable: false })
  message!: string

  @Column({ name: 'stack_trace', type: 'text', nullable: true })
  stackTrace!: string | null
}
