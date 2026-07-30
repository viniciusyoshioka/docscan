import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import type { DocumentEntity, DocumentId } from '../../entities'


@Entity({ name: 'documents' })
export class TypeOrmDocumentEntity implements DocumentEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: DocumentId

  @Column({ name: 'title', type: 'text', nullable: false })
  title!: string

  @Column({ name: 'created_at', type: 'integer', nullable: false })
  createdAt!: number

  @Column({ name: 'updated_at', type: 'integer', nullable: false })
  updatedAt!: number
}
