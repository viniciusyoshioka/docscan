import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import type { DocumentId, PictureEntity, PictureId } from '../../entities'


@Entity({ name: 'pictures' })
export class TypeOrmPictureEntity implements PictureEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: PictureId

  @Column({ name: 'document_id', type: 'integer', nullable: false })
  documentId!: DocumentId

  @Column({ name: 'file_name', type: 'text', nullable: false })
  fileName!: string

  @Column({ name: 'position', type: 'integer', nullable: false })
  position!: number
}
